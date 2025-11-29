// src/chatbot/components/ChatForm.tsx
import { useRef, FormEvent } from "react";
import type { ChatRow } from "../ChatbotApp";

interface Props {
    chatHistory: ChatRow[];
    setChatHistory: React.Dispatch<React.SetStateAction<ChatRow[]>>;
    generateBotResponse: (history: ChatRow[]) => Promise<void>;
}

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }: Props) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        const userMessage = (inputRef.current?.value || "").trim();
        if (!userMessage) return;
        if (inputRef.current) inputRef.current.value = "";

        const nextHistory: ChatRow[] = [
            ...chatHistory,
            { role: "user", text: userMessage, hideInChat: false },
        ];

        setChatHistory(nextHistory);

        // Add "Thinking..." placeholder
        setTimeout(() => {
            setChatHistory((prev) => [
                ...prev,
                { role: "model", text: "Thinking...", hideInChat: false },
            ]);
        }, 100);

        // Call API
        generateBotResponse(nextHistory);
    };

    return (
        <form className="chat-form" onSubmit={handleFormSubmit}>
            <input
                ref={inputRef}
                type="text"
                placeholder="Message..."
                className="message-input"
                required
            />
            <button className="material-symbols-rounded" type="submit">
                keyboard_arrow_up
            </button>
        </form>
    );
};

export default ChatForm;
