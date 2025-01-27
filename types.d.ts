export interface Product {
    _id: string;
    category: number;
    title: string;
    price: number;
    description: string;
    image: string | null;
    create_at: string;
}

export type ProductWithoutId = Omit<Product, 'id', 'create_at'>

export interface  Category {
    _id: string;
    title: string;
    description: string;
}


export interface UserFields {
    username: string;
    password: string;
    token: string;
    role: string;
}