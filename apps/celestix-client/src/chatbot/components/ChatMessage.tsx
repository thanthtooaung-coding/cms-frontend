// src/chatbot/components/ChatMessage.tsx
import ChatbotIcon from "./ChatbotIcon";
import type { ChatRow } from "../ChatbotApp";

const ChatMessage = ({ chat }: { chat: ChatRow }) => {
    if (chat.hideInChat) return null;
    const isBot = chat.role === "model";

    return (
        <div className={`message ${isBot ? "bot" : "user"}-message`}>
            {isBot && <ChatbotIcon />}
            <p className="message-text">{chat.text}</p>
        </div>
    );
};

export default ChatMessage;
