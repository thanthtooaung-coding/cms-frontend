// src/pages/ChatbotPage.tsx
import ChatbotApp from "../chatbot/ChatbotApp";

const ChatbotPage = () => {
    return (
        <div className="min-h-screen bg-gradient-cinema flex items-center justify-center p-4">
            <div className="w-full max-w-6xl">
                <ChatbotApp />
            </div>
        </div>
    );
};

export default ChatbotPage;
