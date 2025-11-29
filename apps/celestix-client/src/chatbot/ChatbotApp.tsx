// src/chatbot/ChatbotApp.tsx
import { useEffect, useRef, useState } from "react";
import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import { generateCompanyInfo } from "./components/companyInfo";
import "./Chatbot.css";

type Role = "user" | "model";

export interface ChatRow {
    hideInChat: boolean;
    role: Role;
    text: string;
}

const ChatbotApp = () => {
    const [companyInfo, setCompanyInfo] = useState<string>("");
    const [chatHistory, setChatHistory] = useState<ChatRow[]>([]);
    const [showChatBot, setShowChatbot] = useState(false);
    const chatBodyRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchInfo = async () => {
            const info = await generateCompanyInfo();
            setCompanyInfo(info);
            setChatHistory([
                { hideInChat: true, role: "model", text: info },
                { role: "model", text: "👋 Hey there! How can I help you today?", hideInChat: false },
            ]);
        };
        fetchInfo();
    }, []);

    const generateBotResponse = async (history: ChatRow[]) => {
        const updateHistory = (text: string) => {
            setChatHistory((prev) => [
                ...prev.slice(0, -1), // remove "Thinking..."
                { role: "model", text, hideInChat: false },
            ]);
        };

        const apiHistory = history.map(({ role, text }) => ({
            role: role === "model" ? "assistant" : role,
            content: text,
        }));

        try {
            const response = await fetch(
                import.meta.env.VITE_API_URL, // e.g. https://api.openai.com/v1/chat/completions
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
                    },
                    body: JSON.stringify({
                        model: "gpt-4o-mini",
                        messages: [
                            {
                                role: "system",
                                content: `You are CELESTIX Support Bot. Answer ONLY using the company info below—do not add unrelated content. Info:\n${companyInfo}`,
                            },
                            ...apiHistory,
                        ],
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error("Too many requests 😵. Please wait and try again.");
                }
                throw new Error(data?.error?.message || "Something went wrong!");
            }

            const apiResponseText: string = (data.choices?.[0]?.message?.content || "").trim();
            updateHistory(apiResponseText || "Sorry, I couldn't generate a reply.");
        } catch (err: unknown) {
            console.error("Bot error:", err);
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : typeof err === "string"
                        ? err
                        : "Something went wrong.";
            updateHistory(`⚠️ Oops! ${errorMessage}`);
        }
    };

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTo({
                top: chatBodyRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [chatHistory]);

    // For full-page chatbot, always show it
    const isFullPage = window.location.pathname.includes('/chatbot');
    
    return (
        <div className={`container ${showChatBot || isFullPage ? "show-chatbot" : ""}`}>
            {!isFullPage && (
                <button onClick={() => setShowChatbot((p) => !p)} id="chatbot-toggler">
                    <span className="material-symbols-rounded">mode_comment</span>
                    <span className="material-symbols-rounded">close</span>
                </button>
            )}

            <div className="chatbot-popup">
                <div className="chat-header">
                    <div className="header-info">
                        <ChatbotIcon />
                        <h2 className="logo-text">Chatbot</h2>
                    </div>
                    {!isFullPage && (
                        <button onClick={() => setShowChatbot((p) => !p)} className="material-symbols-rounded">
                            keyboard_arrow_down
                        </button>
                    )}
                </div>

                <div ref={chatBodyRef} className="chat-body">
                    {chatHistory.map((chat, i) => (
                        <ChatMessage key={i} chat={chat} />
                    ))}
                </div>

                <div className="chat-footer">
                    <ChatForm
                        chatHistory={chatHistory}
                        setChatHistory={setChatHistory}
                        generateBotResponse={generateBotResponse}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatbotApp;