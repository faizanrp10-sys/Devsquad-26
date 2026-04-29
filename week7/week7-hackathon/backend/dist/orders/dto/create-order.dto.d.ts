export declare class OrderItemDto {
    productId: string;
    productName: string;
    productImage?: string;
    price: number;
    quantity: number;
    note?: string;
}
export declare class CreateOrderDto {
    items: OrderItemDto[];
    discount?: number;
    orderType: string;
    paymentMethod: string;
    tableNo?: string;
    customerName?: string;
}
