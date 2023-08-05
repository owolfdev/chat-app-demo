"use client";

import React, { useState, useEffect, use } from "react";

import { Alert } from "@/components/alert";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useUser } from "@/lib/UserContext";

type ChatMessage = {
  chat_id: string;
  content: string;
  id: string;
  sender_id: string;
  sent_at: string;
  updated_at: string;
};

const deleteChatMessage_AlertMessage =
  "Are you sure you want to delete this message?";

const users = [
  {
    id: "user1",
    firstName: "Cat",
    lastName: "Girl",
    avatar:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2643&q=80",
  },
  {
    id: "user2",
    firstName: "Dog",
    lastName: "Boy",
    avatar:
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2148&q=80",
  },
];

export function Chat({ supabase }: { supabase: any }) {
  const [avatars, setAvatars] = useState<Record<string, string>>({});
  const [newMessage, setNewMessage] = useState<string>("");
  const [chatId, setChatId] = useState<string>(
    "4113f429-c4ad-42aa-b43f-0a2bcafaeaa5"
  );
  const userContext = useUser();

  const user = userContext ? userContext.user : null;

  const localStorageKey = "demoChatMessages";

  const saveMessagesToLocalStorage = (messages: ChatMessage[]) => {
    localStorage.setItem(localStorageKey, JSON.stringify(messages));
  };

  const getMessagesFromLocalStorage = (): ChatMessage[] => {
    const saved = localStorage.getItem(localStorageKey);
    return saved ? JSON.parse(saved) : [];
  };

  const toggleUser = () => {
    setActiveUser((prevUser) =>
      prevUser.id === "user1" ? users[1] : users[0]
    );
  };

  const [data, setData] = useState<ChatMessage[]>(
    getMessagesFromLocalStorage()
  );
  const [activeUser, setActiveUser] = useState(users[0]);

  const getData = async () => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select()
      .eq("chat_id", chatId);
    if (data) {
      setData(data);
    }

    return data;
  };

  useEffect(() => {
    setAvatars({
      user1: users[0].avatar,
      user2: users[1].avatar,
    });
  }, []);

  useEffect(() => {}, [newMessage]);

  useEffect(() => {
    getData();
  }, []);

  const handleSendMessage = (e: any) => {
    e.preventDefault();

    const newChatMessage: ChatMessage = {
      id: `msg-${Date.now()}`, // mock ID using the current timestamp
      sender_id: activeUser.id,
      content: newMessage,
      chat_id: chatId,
      sent_at: new Date().toISOString(), // current date-time in ISO format
      updated_at: new Date().toISOString(),
    };

    const updatedMessages = [...data, newChatMessage];
    setData(updatedMessages);
    saveMessagesToLocalStorage(updatedMessages);
    setNewMessage("");
  };

  useEffect(() => {
    if (data) {
      setData(data);
    }

    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
        },
        (payload: any) => setData((messages) => [...messages, payload.new])
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [data]);

  const ChatView = ({ data }: { data: ChatMessage[] }) => {
    const userContext = useUser();
    const userId = userContext ? userContext.user?.id : null;
    const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(
      null
    );

    const sortedData = [...data].sort(
      (a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime()
    );

    const handleDeleteMessage = async (id: string) => {
      const { data, error } = await supabase
        .from("chat_messages")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting message", error);
      } else {
        getData();
      }
    };

    return (
      <div className="w-full border rounded-lg h-[400px] overflow-y-scroll p-4 flex flex-col">
        {sortedData.map((item, index) => (
          <div
            key={index}
            className={`w-full mb-2 flex items-start ${
              userId === item.sender_id ? "justify-end" : "justify-start"
            }`}
            onMouseEnter={() => setHoveredMessageId(item.id)}
            onMouseLeave={() => setHoveredMessageId(null)}
          >
            <div
              style={{ maxWidth: "75%" }}
              className="flex gap-1 items-end relative"
            >
              {userId !== item.sender_id && (
                <div className="w-6 h-6 bg-cover bg-center rounded-full overflow-hidden flex-shrink-0">
                  <img src={avatars[item.sender_id] || ""} />
                </div>
              )}
              <div>
                <div className="text-[11px] text-gray-300 pr-3 pl-3 text-right">
                  {new Date(item.sent_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </div>
                <div
                  className={`${
                    userId === item.sender_id
                      ? "bg-gray-600 text-white"
                      : "bg-gray-300 text-black"
                  } rounded-2xl px-3 py-2 break-words text-sm`}
                >
                  {userId === item.sender_id &&
                    hoveredMessageId === item.id && (
                      <Alert
                        action={handleDeleteMessage}
                        item={item.id}
                        message={deleteChatMessage_AlertMessage}
                        title="Delete Message"
                      />
                    )}
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full mx-auto ">
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
        <span className="font-base text-md">
          {activeUser.firstName} {activeUser.lastName}
        </span>
      </CardHeader>
      <CardContent>
        {user && (
          <>
            <form onSubmit={handleSendMessage}>
              <div className="flex flex-col gap-2">
                <Input
                  value={newMessage}
                  className="w-full sm:w-auto"
                  placeholder="Enter your message"
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <div>
                  <Button
                    className="w-full sm:w-auto mt-2 sm:mt-0 sm:ml-2"
                    type="submit"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </form>
            <div className="mt-6">
              <ChatView data={data} />
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <button onClick={toggleUser}>Switch User</button>
        <span>Active User: {activeUser.firstName}</span>
      </CardFooter>
    </Card>
  );
}
