import React, { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput.jsx";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton.jsx";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder.jsx";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

function ChatContainer() {
    const {
        selectedUser,
        getMessagesByUserId,
        messages,
        isMessagesLoading,
        subscribeToMessages,
        unsubscribeFromMessages,
    } = useChatStore();
    const { authUser } = useAuthStore();
    const messageEndRef = useRef(null);

    useEffect(() => {
        if (selectedUser?._id) {
            getMessagesByUserId(selectedUser._id);
        }
        subscribeToMessages();
        // Clean Up
        return () => unsubscribeFromMessages();
    }, [
        selectedUser,
        getMessagesByUserId,
        subscribeToMessages,
        unsubscribeFromMessages,
    ]);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sortedMessages = [...messages].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    );

    return (
        <div className="flex flex-col h-full">
            <ChatHeader />

            <div className="flex-1 overflow-y-auto px-6 py-8">
                {messages.length > 0 && !isMessagesLoading ? (
                    <div className="max-w-3xl mx-auto space-y-6">
                        {sortedMessages.map((msg) => (
                            <div
                                key={msg._id}
                                className={`chat ${
                                    msg.senderId === authUser._id
                                        ? "chat-end"
                                        : "chat-start"
                                }`}>
                                <div
                                    className={`chat-bubble ${
                                        msg.senderId === authUser._id
                                            ? "bg-cyan-600 text-white"
                                            : "bg-slate-800 text-slate-200"
                                    }`}>
                                    {msg.image && (
                                        <img
                                            src={msg.image}
                                            alt="Shared"
                                            className="rounded-lg h-48 object-cover"
                                        />
                                    )}

                                    {msg.text && (
                                        <p className="mt-2">{msg.text}</p>
                                    )}

                                    <p className="text-xs mt-1 opacity-75">
                                        {new Date(
                                            msg.createdAt,
                                        ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div ref={messageEndRef} /> {/* Scroll Target */}
                    </div>
                ) : isMessagesLoading ? (
                    <MessagesLoadingSkeleton />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <NoChatHistoryPlaceholder
                            name={selectedUser.fullName}
                        />
                    </div>
                )}
            </div>
            <MessageInput />
        </div>
    );
}

export default ChatContainer;
