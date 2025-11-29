import React from "react";
import { useNavigate } from "react-router-dom";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Ticket, Popcorn } from "lucide-react";

const ServicePage: React.FC = () => {
    const navigate = useNavigate();
    const { getPath } = useTenantPath();

    const services = [
        {
            id: "tickets",
            title: "Movie Tickets",
            description: "Book tickets for the latest movies with ease.",
            icon: <Ticket className="w-8 h-8 text-primary" />,
            action: () => navigate(getPath("/discover")),
        },
        {
            id: "food",
            title: "Food & Snacks",
            description: "Order delicious food and snacks right from your seat.",
            icon: <Popcorn className="w-8 h-8 text-primary" />,
            action: () => navigate(getPath("/food")),
        },
        {
            id: "support",
            title: "Customer Support",
            description: "Chat with our support bot for quick assistance.",
            icon: <MessageCircle className="w-8 h-8 text-primary" />,
            action: () => navigate(getPath("/chatbot")), // 👈 goes to your chatbot page
        },
    ];

    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-8 text-center">Our Services</h1>

            <div className="grid gap-6 md:grid-cols-3">
                {services.map((service) => (
                    <Card
                        key={service.id}
                        className="rounded-2xl shadow-lg hover:shadow-xl transition cursor-pointer"
                        onClick={service.action}
                    >
                        <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                            {service.icon}
                            <h2 className="text-xl font-semibold">{service.title}</h2>
                            <p className="text-muted-foreground">{service.description}</p>
                            <Button onClick={service.action}>Explore</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ServicePage;
