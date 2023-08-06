import React, { useState, useEffect } from "react";

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
    avatar: "/cat-sq.jpg",
  },
  {
    id: "user2",
    firstName: "Dog",
    lastName: "Boy",
    avatar: "/dog-sq.jpg",
  },
];

export function Chat() {
  const [avatars, setAvatars] = useState<Record<string, string>>({});
  const [newMessage, setNewMessage] = useState<string>("");
  const [chatId] = useState<string>("4113f429-c4ad-42aa-b43f-0a2bcafaeaa5");

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

  const [data, setData] = useState<ChatMessage[]>([]);
  const [activeUser, setActiveUser] = useState(users[0]);

  const toggleUser = () => {
    setActiveUser((prevUser) =>
      prevUser.id === "user1" ? users[1] : users[0]
    );
  };

  useEffect(() => {
    // Move the function inside useEffect
    const getMessagesFromLocalStorage = (): ChatMessage[] => {
      const saved = localStorage.getItem(localStorageKey);
      return saved ? JSON.parse(saved) : [];
    };

    // Only call the function once the component is mounted
    setData(getMessagesFromLocalStorage());
  }, []);

  useEffect(() => {
    setAvatars({
      user1: users[0].avatar,
      user2: users[1].avatar,
    });
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
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

  const handleDeleteMessage = async (id: string) => {
    const updatedMessages = data.filter((message) => message.id !== id);
    setData(updatedMessages);
    saveMessagesToLocalStorage(updatedMessages);
  };

  const ChatView = ({
    data,
    onDeleteMessage,
  }: {
    data: ChatMessage[];
    onDeleteMessage: (id: string) => void;
  }) => {
    const userId = user ? user.id : null;
    const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(
      null
    );

    const sortedData = [...data].sort(
      (a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime()
    );

    return (
      <div className="w-full border rounded-lg h-[400px] overflow-y-scroll p-4 flex flex-col">
        {sortedData.map((item, index) => (
          <div
            key={index}
            className={`w-full mb-2 flex items-start ${
              activeUser.id === item.sender_id ? "justify-end" : "justify-start"
            }`}
            onMouseEnter={() => setHoveredMessageId(item.id)}
            onMouseLeave={() => setHoveredMessageId(null)}
          >
            <div
              style={{ maxWidth: "75%" }}
              className="flex gap-1 items-end relative"
            >
              {activeUser.id !== item.sender_id && (
                <div className="w-6 h-6 bg-cover bg-center rounded-full overflow-hidden flex-shrink-0">
                  <img src={avatars[item.sender_id] || ""} alt="User Avatar" />
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
                    activeUser.id === item.sender_id
                      ? "bg-gray-600 text-white"
                      : "bg-gray-300 text-black"
                  } rounded-2xl px-3 py-2 break-words text-sm`}
                >
                  {activeUser.id === item.sender_id &&
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
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
        <span className="font-base text-md">
          {activeUser.firstName} {activeUser.lastName}
        </span>
      </CardHeader>
      <CardContent>
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
          <ChatView data={data} onDeleteMessage={handleDeleteMessage} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={toggleUser}>Switch User</Button>
        <span>
          Active User:{" "}
          <span className="bg-gray-200 rounded-xl py-1 px-2">
            {activeUser.firstName}
          </span>
        </span>
      </CardFooter>
    </Card>
  );
}
