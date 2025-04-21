import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('error: Missing Supabase URL or Anon Key');
}

export type Database = {
    public: {
        Tables: object
        Views: object
        Functions: object
    },
    products: {
        Tables: {
            categories: {
                Row: {
                    id: number
                    created_at: string | null
                    name: string | null
                    description: string | null
                }
                Insert: {
                    id?: number
                    created_at?: string | null
                    name?: string | null
                    description?: string | null
                }
                Update: {
                    id?: number
                    created_at?: string | null
                    name?: string | null
                    description?: string | null
                }
                Relationships: []
            },
            products: {
                Row: {
                    id: number
                    created_at: string | null
                    category_id: number | null
                    name: string | null
                    description: string | null
                    price: number | null
                    sku: string | null
                }
                Insert: {
                    id?: number
                    created_at?: string | null
                    category_id?: number | null
                    name?: string | null
                    description?: string | null
                    price?: number | null
                    sku?: string | null
                }
                Update: {
                    id?: number
                    created_at?: string | null
                    category_id?: number | null
                    name?: string | null
                    description?: string | null
                    price?: number | null
                    sku?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "products_category_id_fkey"
                        columns: ["category_id"]
                        referencedRelation: "categories"
                        referencedColumns: ["id"]
                    }
                ]
            },
            productImages: {
                Row: {
                    id: number
                    created_at: string | null
                    url: string | null
                    is_primary: boolean | null
                    alt_text: string | null
                    product_id: number | null
                }
                Insert: {
                    id?: number
                    created_at?: string | null
                    url?: string | null
                    is_primary?: boolean | null
                    alt_text?: string | null
                    product_id?: number | null
                }
                Update: {
                    id?: number
                    created_at?: string | null
                    url?: string | null
                    is_primary?: boolean | null
                    alt_text?: string | null
                    product_id?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "productImages_product_id_fkey"
                        columns: ["product_id"]
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    }
                ]
            }
        },
        Views: object,
        Functions: object
    },
    inventoryManagement: {
        Tables: {
            WareHouses: {
                Row: {
                    id: number
                    created_at: string | null
                    name: string | null
                    location: string | null
                    active: boolean | null
                    supervisor_id: number | null
                }
                Insert: {
                    id?: number
                    created_at?: string | null
                    name?: string | null
                    location?: string | null
                    active?: boolean | null
                    supervisor_id?: number | null
                }
                Update: {
                    id?: number
                    created_at?: string | null
                    name?: string | null
                    location?: string | null
                    active?: boolean | null
                    supervisor_id?: number | null
                }
                Relationships: []
            },
            Warehouse_Inventory: {
                Row: {
                    id: number
                    created_at: string | null
                    product_id: number | null
                    quantity: number | null
                    minimal_quantity: number | null
                    warehouse_id: number | null
                }
                Insert: {
                    id?: number
                    created_at?: string | null
                    product_id?: number | null
                    quantity?: number | null
                    minimal_quantity?: number | null
                    warehouse_id?: number | null
                }
                Update: {
                    id?: number
                    created_at?: string | null
                    product_id?: number | null
                    quantity?: number | null
                    minimal_quantity?: number | null
                    warehouse_id?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "warehouse_inventory_product_id_fkey"
                        columns: ["product_id"]
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                        referencedSchema: "products"
                    },
                    {
                        foreignKeyName: "warehouse_inventory_warehouse_id_fkey"
                        columns: ["warehouse_id"]
                        referencedRelation: "WareHouses"
                        referencedColumns: ["id"]
                    }
                ]
            }
        },
        Views: object,
        Functions: object
    }
}

// Create typed Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
