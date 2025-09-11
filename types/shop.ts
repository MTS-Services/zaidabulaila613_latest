export interface ShopImage {
    path: string;
}

export interface ShopItem {
    id: string;
    shopName: string;
    description: string;
    coverImage?: ShopImage | null;
    profileImage?: ShopImage | null;
    tags: string[]
    user?: {
        id: string
    },
    shopPhoneNumber?: string
}

export interface ShopsResponse {
    shops: {
        data: ShopItem[];
        total: number;
    };
}
export interface ShopById {
    findShopById: ShopItem
}