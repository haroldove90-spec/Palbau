import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  secondaryImages?: string[];
  description: string;
  category?: string;
  stock: number;
  is_active: boolean;
};

type ProductContextType = {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (id: number, product: Partial<Omit<Product, 'id'>>) => Promise<Product>;
  deleteProduct: (id: number) => Promise<void>;
};

const ProductContext = createContext<ProductContextType | null>(null);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within a ProductProvider');
  return context;
};

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      
      // Map database fields to frontend type if necessary
      const mappedProducts: Product[] = (data || []).map(p => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        image: p.image,
        secondaryImages: p.secondary_images,
        description: p.description,
        category: p.category,
        stock: p.stock || 0,
        is_active: p.is_active !== undefined ? p.is_active : true
      }));

      setProducts(mappedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: product.name,
          price: product.price,
          image: product.image,
          secondary_images: product.secondaryImages || [],
          description: product.description,
          category: product.category,
          stock: product.stock,
          is_active: product.is_active
        }])
        .select();

      if (error) throw error;
      
      if (data && data[0]) {
        const newProduct: Product = {
          id: data[0].id,
          name: data[0].name,
          price: Number(data[0].price),
          image: data[0].image,
          secondaryImages: data[0].secondary_images,
          description: data[0].description,
          category: data[0].category,
          stock: data[0].stock,
          is_active: data[0].is_active
        };
        setProducts(prev => [newProduct, ...prev]);
        return newProduct;
      }
      throw new Error('No se recibió respuesta de la base de datos al añadir el producto.');
    } catch (error: any) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = async (id: number, product: Partial<Omit<Product, 'id'>>): Promise<Product> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: product.name,
          price: product.price,
          image: product.image,
          secondary_images: product.secondaryImages,
          description: product.description,
          category: product.category,
          stock: product.stock,
          is_active: product.is_active
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      
      if (data && data[0]) {
        const updated: Product = {
          id: data[0].id,
          name: data[0].name,
          price: Number(data[0].price),
          image: data[0].image,
          secondaryImages: data[0].secondary_images,
          description: data[0].description,
          category: data[0].category,
          stock: data[0].stock,
          is_active: data[0].is_active
        };
        setProducts(prev => prev.map(p => p.id === id ? updated : p));
        return updated;
      }
      throw new Error('No se encontró el producto para actualizar o no hubo cambios.');
    } catch (error: any) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {loading ? (
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-navy border-t-gold rounded-full animate-spin"></div>
        </div>
      ) : children}
    </ProductContext.Provider>
  );
};
