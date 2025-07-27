export type PageRequestPayload = {
    ownerId: number;
    requestType: 'Learning Management System' | 'E-Commerce System' | 'Booking System' | 'Agency Management System';
    title: string;
    pageDescription: string;
    pageUrl: string;
    logoUrl: string;
};