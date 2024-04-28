export interface Book {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    edition: number;
    isbn13: string;
    imageUrl: string;
    price: number;
    authorId: number;
    authorName: string;
    categoryId: number;
    categoryLabel: string;
}