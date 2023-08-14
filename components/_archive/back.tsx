// "use client";
// import React, { useState, useRef, useEffect } from "react";

// import { Alert } from "@/components/alert";

// import { Button } from "@/components/ui/button";

// import { useUser } from "@/lib/UserContext";

// type ChatMessage = {
//   chat_id: string;
//   content: string;
//   id: string;
//   sender_id: string;
//   sent_at: string;
//   updated_at: string;
// };

// const users = [
//   {
//     id: "user1",
//     firstName: "Cat",
//     lastName: "Girl",
//     avatar: "/cat-sq.jpg",
//   },
//   {
//     id: "user2",
//     firstName: "Dog",
//     lastName: "Boy",
//     avatar: "/dog-sq.jpg",
//   },
// ];

// const deleteChat_AlertMessage = "Are you sure you want to delete this message?";

// function Chat() {
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [currentMessage, setCurrentMessage] = useState<string>("");
//   const bottomRef = useRef<null | HTMLDivElement>(null);

//   //
//   const [data, setData] = useState<ChatMessage[]>([]);
//   const [avatars, setAvatars] = useState<Record<string, string>>({});
//   const [newMessage, setNewMessage] = useState<string>("");
//   const [chatId, setChatId] = useState<string>(
//     "4113f429-c4ad-42aa-b43f-0a2bcafaeaa5"
//   );
//   const userContext = useUser();

//   const userId = userContext ? userContext.user?.id : null;

//   const user = userContext ? userContext.user : null;

//   const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);

//   const localStorageKey = "demoChatMessages";

//   const [activeUser, setActiveUser] = useState(users[0]);

//   const saveMessagesToLocalStorage = (messages: ChatMessage[]) => {
//     localStorage.setItem(localStorageKey, JSON.stringify(messages));
//   };

//   const toggleUser = () => {
//     setActiveUser((prevUser) =>
//       prevUser.id === "user1" ? users[1] : users[0]
//     );
//   };

//   //   useEffect(() => {
//   //     getData();
//   //   }, []);

//   useEffect(() => {
//     setMessages(data.map((item) => item));
//     // loadAvatars();
//   }, [data]);

//   useEffect(() => {
//     // Move the function inside useEffect
//     const getMessagesFromLocalStorage = (): ChatMessage[] => {
//       const saved = localStorage.getItem(localStorageKey);
//       return saved ? JSON.parse(saved) : [];
//     };

//     // Only call the function once the component is mounted
//     setData(getMessagesFromLocalStorage());
//   }, []);

//   useEffect(() => {
//     setAvatars({
//       user1: users[0].avatar,
//       user2: users[1].avatar,
//     });
//   }, []);

//   //   const getData = async () => {
//   //     const { data, error } = await supabase
//   //       .from("chat_messages")
//   //       .select()
//   //       .eq("chat_id", chatId);
//   //     if (data) {
//   //       setData(data);
//   //     }

//   //     return data;
//   //   };

//   //   const loadAvatars = async () => {
//   //     const senderIds = Array.from(new Set(data.map((item) => item.sender_id)));
//   //     for (let id of senderIds) {
//   //       const { data } = await supabase
//   //         .from("profiles")
//   //         .select("avatar")
//   //         .eq("user_id", id);
//   //       if (data && data.length > 0) {
//   //         setAvatars((prevAvatars) => ({
//   //           ...prevAvatars,
//   //           [id]: data[0].avatar,
//   //         }));
//   //       }
//   //     }
//   //   };

//   const handleSendMessage = (e: React.FormEvent) => {
//     e.preventDefault();

//     const newChatMessage: ChatMessage = {
//       id: `msg-${Date.now()}`, // mock ID using the current timestamp
//       sender_id: activeUser.id,
//       content: currentMessage,
//       chat_id: activeUser.id,
//       sent_at: new Date().toISOString(), // current date-time in ISO format
//       updated_at: new Date().toISOString(),
//     };

//     const updatedMessages = [...data, newChatMessage];
//     setData(updatedMessages);
//     saveMessagesToLocalStorage(updatedMessages);
//     setNewMessage("");
//     setCurrentMessage("");
//   };

//   //   const handleSend = async (e: any) => {
//   //     e.preventDefault();
//   //     if (currentMessage.trim() !== "" && user?.id) {
//   //       // Ensure user.id is defined
//   //       const formattedMessage = {
//   //         chat_id: chatId,
//   //         content: currentMessage.trim(),
//   //         sender_id: user.id,
//   //       };
//   //       const { data, error } = await supabase
//   //         .from("chat_messages")
//   //         .insert({
//   //           sender_id: user?.id,
//   //           content: formattedMessage.content,
//   //           chat_id: chatId,
//   //         })
//   //         .single();
//   //       //   setMessages((prevMessages) => [...prevMessages, formattedMessage]);
//   //       setCurrentMessage("");
//   //     }
//   //   };

//   //   useEffect(() => {
//   //     if (data) {
//   //       setData(data);
//   //     }

//   //     const channel = supabase
//   //       .channel("schema-db-changes-reverse-scroll")
//   //       .on(
//   //         "postgres_changes",
//   //         {
//   //           event: "INSERT",
//   //           schema: "public",
//   //           table: "chat_messages",
//   //         },
//   //         (payload: any) => setData((messages) => [...messages, payload.new])
//   //       )
//   //       .subscribe();

//   //     return () => {
//   //       channel.unsubscribe();
//   //     };
//   //   }, [data]);

//   // Scroll to bottom whenever the messages array changes
//   useEffect(() => {
//     if (bottomRef.current) {
//       bottomRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   const handleDeleteMessage = async (id: string) => {
//     const updatedMessages = data.filter((message) => message.id !== id);
//     setData(updatedMessages);
//     saveMessagesToLocalStorage(updatedMessages);
//   };

//   return (
//     <div>
//       <div className="border border-gray-300 rounded-lg w-full  p-4 ">
//         <div className=" mb-4">
//           <div className="mb-2">
//             <h1 className="font-semibold text-2xl">Welcome</h1>
//             <span className="font-base text-md">{activeUser.firstName}</span>
//           </div>
//           <div className="text-gray-500 text-sm">
//             Type and send messages. To test two-way conversations, switch to a
//             different user and continue chatting.
//           </div>
//         </div>
//         <div className="overflow-y-auto h-64 mb-4 border rounded lg border-gray-200 pb-4 px-4">
//           {messages.map((item, index) => (
//             <div
//               key={index}
//               className={`w-full mb-2 flex items-start ${
//                 activeUser.id === item.sender_id
//                   ? "justify-end"
//                   : "justify-start"
//               }`}
//               onMouseEnter={() => setHoveredMessageId(item.id)}
//               onMouseLeave={() => setHoveredMessageId(null)}
//             >
//               <div
//                 style={{ maxWidth: "75%" }}
//                 className="flex gap-1 items-end relative"
//               >
//                 {activeUser.id !== item.sender_id && (
//                   <div className="w-6 h-6 bg-cover bg-center rounded-full overflow-hidden flex-shrink-0">
//                     <img src={avatars[item.sender_id] || ""} />
//                   </div>
//                 )}
//                 <div>
//                   <div className="text-[11px] text-gray-300 pr-3 pl-3 text-right">
//                     {new Date(item.sent_at).toLocaleString("en-US", {
//                       month: "short",
//                       day: "numeric",
//                       hour: "numeric",
//                       minute: "numeric",
//                       hour12: true,
//                     })}
//                   </div>
//                   <div
//                     className={`${
//                       activeUser.id === item.sender_id
//                         ? "bg-gray-600 text-white"
//                         : "bg-gray-300 text-black"
//                     } rounded-2xl px-3 py-2 break-words text-sm`}
//                   >
//                     {activeUser.id === item.sender_id &&
//                       hoveredMessageId === item.id && (
//                         <Alert
//                           action={handleDeleteMessage}
//                           item={item.id}
//                           message={deleteChat_AlertMessage}
//                           title="Delete Message"
//                         />
//                       )}
//                     {item.content}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//           {/* This is an invisible div, acting as a marker to scroll to */}
//           <div ref={bottomRef} />
//         </div>
//         <form action="" onSubmit={handleSendMessage}>
//           <div className="flex items-center">
//             <input
//               type="text"
//               className="border rounded-l p-2 flex-1 outline-gray-400"
//               value={currentMessage}
//               onChange={(e) => setCurrentMessage(e.target.value)}
//               placeholder="Type a message..."
//             />

//             <button
//               type="submit"
//               // onClick={handleSend}
//               className="px-4 py-2 rounded-r border border-black bg-black text-white"
//             >
//               Send
//             </button>
//           </div>
//         </form>
//         <div className="flex justify-between mt-4">
//           <Button onClick={toggleUser}>Switch User</Button>
//           <span>
//             <span className="text-sm">Active User: </span>
//             <span className="bg-gray-200 rounded-xl py-1 px-2">
//               {activeUser.firstName}
//             </span>
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Chat;
