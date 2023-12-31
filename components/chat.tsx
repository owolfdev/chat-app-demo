import React, { useState, useRef, useEffect } from "react";
import { Alert } from "@/components/alert";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/UserContext";

type ChatMessage = {
  chat_id: string;
  content: string;
  id: string;
  sender_id: string;
  sent_at: string;
  updated_at: string;
};

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

const deleteChat_AlertMessage = "Are you sure you want to delete this message?";

function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const bottomRef = useRef<null | HTMLDivElement>(null);
  const userContext = useUser();
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const localStorageKey = "demoChatMessages";
  const [activeUser, setActiveUser] = useState(users[0]);

  const [avatars, setAvatars] = useState<Record<string, string | undefined>>({
    user1: users[0].avatar,
    user2: users[1].avatar,
  });
  const saveMessagesToLocalStorage = (messages: ChatMessage[]) => {
    localStorage.setItem(localStorageKey, JSON.stringify(messages));
  };

  const toggleUser = () => {
    setActiveUser((prevUser) =>
      prevUser.id === "user1" ? users[1] : users[0]
    );
  };

  useEffect(() => {
    const saved = localStorage.getItem(localStorageKey);
    const storedMessages = saved ? JSON.parse(saved) : [];
    setMessages(storedMessages);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    const newChatMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender_id: activeUser.id,
      content: currentMessage,
      chat_id: activeUser.id,
      sent_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updatedMessages = [...messages, newChatMessage];
    setMessages(updatedMessages);
    saveMessagesToLocalStorage(updatedMessages);
    setCurrentMessage("");
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleDeleteMessage = async (id: string) => {
    const updatedMessages = messages.filter((message) => message.id !== id);
    setMessages(updatedMessages);
    saveMessagesToLocalStorage(updatedMessages);
  };

  return (
    <div>
      <div className="border border-gray-300 rounded-lg w-full  p-4 ">
        <div className=" mb-4">
          <div className="mb-2">
            <h1 className="font-semibold text-2xl">Welcome</h1>
            <span className="font-base text-md">{activeUser.firstName}</span>
          </div>
          <div className="text-gray-500 text-sm">
            Type and send messages. To test two-way conversations, switch to a
            different user and continue chatting.
          </div>
        </div>
        <div className="overflow-y-auto h-64 mb-4 border rounded lg border-gray-200 pb-4 px-4">
          {messages.map((item, index) => (
            <div
              key={index}
              className={`w-full mb-2 flex items-start ${
                activeUser.id === item.sender_id
                  ? "justify-end"
                  : "justify-start"
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
                    <img src={avatars[item.sender_id] || ""} alt="Avatar" />
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
                          action={() => handleDeleteMessage(item.id)}
                          item={item.id}
                          message={deleteChat_AlertMessage}
                          title="Delete Message"
                        />
                      )}
                    {item.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={handleSendMessage}>
          <div className="flex items-center">
            <input
              type="text"
              className="border rounded-l p-2 flex-1 outline-gray-400"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-r border border-black bg-black text-white"
            >
              Send
            </button>
          </div>
        </form>
        <div className="flex justify-between mt-4">
          <Button onClick={toggleUser}>Switch User</Button>
          <span>
            <span className="text-sm">Active User: </span>
            <span className="bg-gray-200 rounded-xl py-1 px-2">
              {activeUser.firstName}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Chat;
