// types/product.ts
/**
 * Product interface for SESA promotional products
 * Matches the Supabase database schema with proper TypeScript types
 */
export interface Product {
    id: number;
    name: string;
    price: number;
    description?: string;
    sku?: string;
    category_id?: number;
    dimensions?: string;
    material?: string;
    created_at?: string;

    // Image-related properties
    primary_image_url?: string;

    // Joined fields from other tables
    category_name?: string;

    // Support for categories from Supabase join
    categories?: {
        id: number;
        name: string;
    } | { id: number; name: string; }[];
}

/**
 * Props for the ProductCard component
 */
export interface ProductCardProps {
    product: Product;
    onClick?: (product: Product) => void;
}

/**
 * Type for product images
 */
export interface ProductImage {
    id: number;
    product_id: number;
    url: string;
    is_primary: boolean;
    alt_text?: string;
    path?: string;
}

/**
 * Types for product filtering and sorting
 */
export type SortDirection = 'asc' | 'desc';
export type SortField = keyof Product | null;

/**
 * Utility type to transform product data from Supabase
 * Handles null to undefined conversion for TypeScript compatibility
 */
export function transformProductData(rawData: any): Product {
    return {
        id: rawData.id,
        name: rawData.name,
        price: rawData.price,
        description: rawData.description || undefined,
        sku: rawData.sku || undefined,
        category_id: rawData.category_id,
        dimensions: rawData.dimensions || undefined,
        material: rawData.material || undefined,
        created_at: rawData.created_at,

        // Handle the primary image URL - convert null to undefined
        primary_image_url: rawData.primary_image_url || undefined,

        // Handle category information
        category_name: rawData.category_name ||
            (rawData.categories ?
                (Array.isArray(rawData.categories)
                    ? rawData.categories[0]?.name
                    : rawData.categories.name)
                : undefined),

        // Pass through the categories object for components that need it
        categories: rawData.categories
    };
}