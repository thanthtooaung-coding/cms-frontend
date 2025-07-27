export interface PageCategory {
    colors: string;
    bgColor: string;
    icon: any;
}

export interface PageResponse {
    id: number;
    title: string;
    category: string;
    description: string;
    updated: string;
    logo: string;
    stats: { users: string; completion: string };
}