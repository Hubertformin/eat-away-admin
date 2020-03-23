/*
* Author: Hubert Formin
* Date: 26-11-2019 at 2:30 AM
*/

export interface UserModel {
    id?: string;
    name?: string;
    email?: string;
    phoneNumber?: string;
    password?: string;
    dateOfBirth?: Date;
    locationCoords?: {lat: number, long: number};
}

export interface CategoryModel {
    id?: string;
    name?: string;
    imageUrl?: string;
    items?: number;
}

export interface DevicesModel {
    id?: string;
    token?: string;
    uid?: string;
}

export interface ItemModel {
    id?: string;
    name?: string;
    category?: string;
    unitPrice?: number;
    units?: string;
    imageUrl?: string;
    orderCount?: number;
    date?: Date;
}

export interface CartItem {
    id?: string;
    name?: string;
    imageUrl?: string;
    unitPrice?: number;
    quantity?: number;
    units?: string;
    totalAmount?: number;
}

export interface OrderStats {
    id?: string;
    totalAmount: number;
    totalOrders: number;
}

export declare type SaleStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface OrderModel {
    id?: string;
    customerId: string;
    invoiceNumber?: string;
    customer: UserModel;
    items: CartItem[];
    totalAmount: number;
    status: SaleStatus;
    date: Date;
}
