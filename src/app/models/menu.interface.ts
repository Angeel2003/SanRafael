export interface MenuItem {
    id?: string;
    name: string;
    pictogram: {
        url: string,
        path: string,
        file?: File
    };
    image: {
        url: string,
        path: string,
        file?: File
    };
}

export interface ComandaMenu extends MenuItem {
    quantity: number;
}