// dashboard/src/components/Productos/EditModal.tsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import MultipleImageUploader from './MultipleImageUploader';

// Product type based on your database schema
type Product = {
    id: number;
    created_at: string;
    category_id: number;
    name: string;
    description: string;
    price: number;
    sku: string;
    category_name?: string;
    dimensions?: string;  // Added dimensions field
    material?: string;    // Added material field
};

// Category type for dropdown
type Category = {
    id: number;
    name: string;
};

// Product image type
interface ProductImage {
    url: string;
    path: string;
    isPrimary: boolean;
    id?: number; // ID existente para imágenes ya guardadas
}

interface EditProductModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
                                                               product,
                                                               isOpen,
                                                               onClose,
                                                               onSuccess
                                                           }) => {
    const [formData, setFormData] = useState<Omit<Product, 'created_at' | 'category_name'>>({
        id: product.id,
        category_id: product.category_id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        sku: product.sku || '',
        dimensions: product.dimensions || '',
        material: product.material || ''
    });

    const [categories, setCategories] = useState<Category[]>([]);
    const [productImages, setProductImages] = useState<ProductImage[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imagesLoading, setImagesLoading] = useState(true);

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('categories')
                    .select('id, name')
                    .order('name', { ascending: true });

                if (error) throw error;

                setCategories(data || []);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Fetch product images when modal opens
    useEffect(() => {
        const fetchProductImages = async () => {
            if (!isOpen) return;

            try {
                setImagesLoading(true);

                const { data, error } = await supabase
                    .from('product_images')
                    .select('id, url, path, is_primary')
                    .eq('product_id', product.id)
                    .order('is_primary', { ascending: false });

                if (error) throw error;

                // Transform data to match our ProductImage type
                const transformedImages: ProductImage[] = (data || []).map(img => ({
                    id: img.id,
                    url: img.url,
                    path: img.path || '',
                    isPrimary: img.is_primary
                }));

                setProductImages(transformedImages);
            } catch (err) {
                console.error('Error fetching product images:', err);
                setError('Error al cargar las imágenes del producto');
            } finally {
                setImagesLoading(false);
            }
        };

        fetchProductImages();
    }, [isOpen, product.id]);

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        // Handle number fields
        if (type === 'number') {
            setFormData(prev => ({
                ...prev,
                [name]: parseFloat(value) || 0
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Handle images change
    const handleImagesChange = (images: ProductImage[]) => {
        setProductImages(images);
    };

    // Validate form inputs
    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('El nombre del producto es obligatorio');
            return false;
        }

        if (!formData.category_id) {
            setError('La categoría es obligatoria');
            return false;
        }

        if (formData.price <= 0) {
            setError('El precio debe ser mayor que cero');
            return false;
        }

        return true;
    };

    // Submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form before submission
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 1. Update product data
            const { error: updateError } = await supabase
                .from('products')
                .update({
                    category_id: formData.category_id,
                    name: formData.name.trim(),
                    description: formData.description.trim() || null,
                    price: formData.price,
                    sku: formData.sku.trim() || null,
                    dimensions: formData.dimensions?.trim() || null,
                    material: formData.material?.trim() || null
                })
                .eq('id', product.id);

            if (updateError) throw updateError;

            // 2. Handle images
            // First, fetch existing product images to compare with current state
            const { data: existingImages, error: imagesError } = await supabase
                .from('product_images')
                .select('id, path')
                .eq('product_id', product.id);

            if (imagesError) throw imagesError;

            // Identify deleted images (images that exist in DB but not in current state)
            const currentImageIds = productImages
                .filter(img => img.id !== undefined)
                .map(img => img.id);

            const deletedImages = existingImages.filter(img =>
                !currentImageIds.includes(img.id)
            );

            // Delete removed images from storage and database
            if (deletedImages.length > 0) {
                // Delete from storage
                const pathsToDelete = deletedImages
                    .map(img => img.path)
                    .filter(Boolean);

                if (pathsToDelete.length > 0) {
                    await supabase.storage
                        .from('products')
                        .remove(pathsToDelete);
                }

                // Delete from database
                const idsToDelete = deletedImages.map(img => img.id);
                await supabase
                    .from('product_images')
                    .delete()
                    .in('id', idsToDelete);
            }

            // Update existing images (primarily for is_primary status)
            const imagesToUpdate = productImages
                .filter(img => img.id !== undefined)
                .map(img => ({
                    id: img.id,
                    is_primary: img.isPrimary
                }));

            for (const img of imagesToUpdate) {
                await supabase
                    .from('product_images')
                    .update({ is_primary: img.is_primary })
                    .eq('id', img.id);
            }

            // Add new images
            const newImages = productImages
                .filter(img => img.id === undefined)
                .map(img => ({
                    product_id: product.id,
                    url: img.url,
                    path: img.path,
                    is_primary: img.isPrimary,
                    alt_text: formData.name
                }));

            if (newImages.length > 0) {
                const { error: insertError } = await supabase
                    .from('product_images')
                    .insert(newImages);

                if (insertError) throw insertError;
            }

            // Notify parent of successful update
            onSuccess();
        } catch (err) {
            console.error('Error updating product:', err);
            setError(err instanceof Error ? err.message : 'Error al actualizar el producto');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Editar Producto</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Información del Producto */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 border-b pb-2">Información del Producto</h3>

                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Descripción
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                ></textarea>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                                    Categoría <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="category_id"
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                >
                                    <option value="">Seleccionar categoría</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                    Precio <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        step="0.01"
                                        min="0.01"
                                        className="w-full pl-7 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                                    SKU
                                </label>
                                <input
                                    type="text"
                                    id="sku"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleChange}
                                    placeholder="Opcional"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700 mb-1">
                                    Dimensiones
                                </label>
                                <input
                                    type="text"
                                    id="dimensions"
                                    name="dimensions"
                                    value={formData.dimensions}
                                    onChange={handleChange}
                                    placeholder="Ejemplo: 10x15x5 cm (Opcional)"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="material" className="block text-sm font-medium text-gray-700 mb-1">
                                    Material
                                </label>
                                <input
                                    type="text"
                                    id="material"
                                    name="material"
                                    value={formData.material}
                                    onChange={handleChange}
                                    placeholder="Ejemplo: Algodón, Cerámica, etc. (Opcional)"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                        </div>

                        {/* Imágenes del Producto */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 border-b pb-2">Imágenes del Producto</h3>

                            {imagesLoading ? (
                                <div className="flex justify-center items-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                                </div>
                            ) : (
                                <MultipleImageUploader
                                    productId={product.id}
                                    initialImages={productImages}
                                    onImagesChange={handleImagesChange}
                                    maxImages={5}
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6 border-t pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Guardando...
                                </div>
                            ) : 'Guardar cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductModal;