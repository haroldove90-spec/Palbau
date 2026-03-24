import React, { createContext, useContext, useState } from 'react';

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  secondaryImages?: string[];
  description: string;
  category?: string;
};

export const initialProducts: Product[] = [
  {
    id: 1,
    name: "Queso Manchego Curado",
    price: 11.00,
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?q=80&w=2073&auto=format&fit=crop",
    description: "Queso de oveja curado con un sabor intenso y textura firme. Ideal para acompañar con un buen vino tinto y carnes frías. Elaborado con los más altos estándares de calidad y madurado cuidadosamente.",
    category: "Quesos Importados"
  },
  {
    id: 2,
    name: "Jamón Ibérico de Bellota",
    price: 45.50,
    image: "https://img.freepik.com/fotos-premium/tapas-jamon-iberico-salchichas-lomo_79295-6159.jpg",
    description: "Auténtico jamón ibérico de bellota, curado durante 36 meses. Un manjar exquisito que se deshace en la boca, con vetas de grasa infiltrada que le otorgan un sabor inigualable.",
    category: "Jamones Selectos"
  },
  {
    id: 3,
    name: "Salchicha Ahumada Premium",
    price: 10.00,
    image: "https://cdn.pixabay.com/photo/2020/02/23/16/26/sausage-4873861_1280.jpg",
    description: "Salchichas ahumadas artesanalmente con madera de encino. Perfectas para asados y parrilladas familiares. Elaboradas con cortes selectos de carne y especias naturales.",
    category: "Salchichas Premium"
  },
  {
    id: 4,
    name: "Queso Oaxaca Tradicional",
    price: 8.50,
    image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?q=80&w=2069&auto=format&fit=crop",
    description: "El clásico queso de hebra mexicano, fresco y perfecto para quesadillas o para disfrutar solo. Su textura suave y sabor delicado lo hacen el favorito de toda la familia.",
    category: "Quesos Nacionales"
  },
  {
    id: 5,
    name: "Chorizo Español Artesanal",
    price: 12.50,
    image: "https://images.unsplash.com/photo-1533622597524-a1215e26c0a2?q=80&w=2070&auto=format&fit=crop",
    description: "Chorizo curado con pimentón de la Vera. Sabor intenso y ligeramente picante, perfecto para tapas o guisos.",
    category: "Embutidos"
  },
  {
    id: 6,
    name: "Queso Gouda Añejo",
    price: 14.00,
    image: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?q=80&w=2070&auto=format&fit=crop",
    description: "Queso holandés madurado por 12 meses. Presenta cristales de sal y un sabor profundo con notas a caramelo.",
    category: "Quesos Importados"
  },
  {
    id: 7,
    name: "Prosciutto di Parma",
    price: 38.00,
    image: "https://mygourmet.com.mx/wp-content/uploads/2022/04/Salami-Calabrese-Castello.webp",
    description: "Jamón curado italiano de sabor dulce y refinado. Cortado en finas láminas, ideal para melón o pan artesanal.",
    category: "Jamones Selectos"
  },
  {
    id: 8,
    name: "Salami a las Finas Hierbas",
    price: 16.50,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9evM-E9fNSKCNztmKax1CucXhjS_uzPDgNQ&s",
    description: "Salami de cerdo curado lentamente y recubierto con una mezcla de hierbas aromáticas. Excelente para tablas de quesos.",
    category: "Embutidos"
  }
];

type ProductContextType = {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
};

const ProductContext = createContext<ProductContextType | null>(null);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within a ProductProvider');
  return context;
};

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now() };
    setProducts(prev => [...prev, newProduct]);
  };

  return (
    <ProductContext.Provider value={{ products, addProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
