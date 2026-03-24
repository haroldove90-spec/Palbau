/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { ShoppingCart, Menu, X, ChevronRight, ChevronLeft, MessageCircle, Award, HeartHandshake, Snowflake } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
};

// --- Data ---
const productsData = [
  {
    id: 1,
    name: "Queso Manchego Curado",
    price: 11.00,
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?q=80&w=2073&auto=format&fit=crop",
    description: "Queso de oveja curado con un sabor intenso y textura firme. Ideal para acompañar con un buen vino tinto y carnes frías. Elaborado con los más altos estándares de calidad y madurado cuidadosamente."
  },
  {
    id: 2,
    name: "Jamón Ibérico de Bellota",
    price: 45.50,
    image: "https://img.freepik.com/fotos-premium/tapas-jamon-iberico-salchichas-lomo_79295-6159.jpg",
    description: "Auténtico jamón ibérico de bellota, curado durante 36 meses. Un manjar exquisito que se deshace en la boca, con vetas de grasa infiltrada que le otorgan un sabor inigualable."
  },
  {
    id: 3,
    name: "Salchicha Ahumada Premium",
    price: 10.00,
    image: "https://cdn.pixabay.com/photo/2020/02/23/16/26/sausage-4873861_1280.jpg",
    description: "Salchichas ahumadas artesanalmente con madera de encino. Perfectas para asados y parrilladas familiares. Elaboradas con cortes selectos de carne y especias naturales."
  },
  {
    id: 4,
    name: "Queso Oaxaca Tradicional",
    price: 8.50,
    image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?q=80&w=2069&auto=format&fit=crop",
    description: "El clásico queso de hebra mexicano, fresco y perfecto para quesadillas o para disfrutar solo. Su textura suave y sabor delicado lo hacen el favorito de toda la familia."
  },
  {
    id: 5,
    name: "Chorizo Español Artesanal",
    price: 12.50,
    image: "https://images.unsplash.com/photo-1533622597524-a1215e26c0a2?q=80&w=2070&auto=format&fit=crop",
    description: "Chorizo curado con pimentón de la Vera. Sabor intenso y ligeramente picante, perfecto para tapas o guisos."
  },
  {
    id: 6,
    name: "Queso Gouda Añejo",
    price: 14.00,
    image: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?q=80&w=2070&auto=format&fit=crop",
    description: "Queso holandés madurado por 12 meses. Presenta cristales de sal y un sabor profundo con notas a caramelo."
  },
  {
    id: 7,
    name: "Prosciutto di Parma",
    price: 38.00,
    image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=2073&auto=format&fit=crop",
    description: "Jamón curado italiano de sabor dulce y refinado. Cortado en finas láminas, ideal para melón o pan artesanal."
  },
  {
    id: 8,
    name: "Salami a las Finas Hierbas",
    price: 16.50,
    image: "https://images.unsplash.com/photo-1585238341267-1cb115e5239e?q=80&w=2070&auto=format&fit=crop",
    description: "Salami de cerdo curado lentamente y recubierto con una mezcla de hierbas aromáticas. Excelente para tablas de quesos."
  }
];

// --- Context ---
type CartItem = {
  product: typeof productsData[0];
  quantity: number;
};

const CartContext = createContext<{
  cart: CartItem[];
  addToCart: (product: typeof productsData[0], quantity: number) => void;
  removeFromCart: (productId: number) => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
} | null>(null);

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: typeof productsData[0], quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, cartCount, cartTotal, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
};

// --- Components ---
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full z-50 transition-all duration-500 bg-white ${isScrolled ? 'shadow-sm py-4' : 'py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Mobile Menu Button */}
        <button className="md:hidden text-navy transition-colors" onClick={() => setMobileMenuOpen(true)}>
          <Menu size={24} />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center justify-center">
          <img 
            src="https://appdesignproyectos.com/palbau.png" 
            alt="PALBAU" 
            className="h-10 md:h-12 object-contain"
            referrerPolicy="no-referrer"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-10 items-center">
          <Link to="/" className="text-xs uppercase tracking-[0.2em] text-navy transition-colors hover:text-lightblue">Inicio</Link>
          <a href="/#tienda" className="text-xs uppercase tracking-[0.2em] text-navy transition-colors hover:text-lightblue">Tienda</a>
          <a href="#contacto" className="text-xs uppercase tracking-[0.2em] text-navy transition-colors hover:text-lightblue">Contacto</a>
        </nav>

        {/* Cart */}
        <button onClick={() => setIsCartOpen(true)} className="relative text-navy transition-colors hover:text-lightblue">
          <ShoppingCart size={22} strokeWidth={1.5} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 bg-white z-50 flex flex-col p-6"
          >
            <div className="flex justify-between items-center mb-16">
              <img 
                src="https://appdesignproyectos.com/palbau.png" 
                alt="PALBAU" 
                className="h-10 object-contain"
                referrerPolicy="no-referrer"
              />
              <button onClick={() => setMobileMenuOpen(false)} className="text-navy"><X size={28} strokeWidth={1.5} /></button>
            </div>
            <nav className="flex flex-col space-y-8 text-xl font-serif text-center">
              <Link to="/" className="text-navy hover:text-lightblue transition-colors" onClick={() => setMobileMenuOpen(false)}>Inicio</Link>
              <a href="/#tienda" className="text-navy hover:text-lightblue transition-colors" onClick={() => setMobileMenuOpen(false)}>Tienda</a>
              <a href="#contacto" className="text-navy hover:text-lightblue transition-colors" onClick={() => setMobileMenuOpen(false)}>Contacto</a>
            </nav>
            <div className="mt-auto text-center pb-8">
              <p className="text-navy/50 text-sm font-light">La excelencia en Lácteos y Embutidos</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: "https://cdn.pixabay.com/photo/2020/02/23/16/26/sausage-4873861_1280.jpg",
      text: "De nuestra selección a tu mesa. Descubre el sabor auténtico de los mejores quesos y embutidos."
    },
    {
      image: "https://img.freepik.com/fotos-premium/tapas-jamon-iberico-salchichas-lomo_79295-6159.jpg",
      text: "Calidad que se siente en cada bocado. Quesos frescos, maduros e importados con frescura garantizada."
    },
    {
      image: "https://thumbs.dreamstime.com/b/diversas-salchichas-29212434.jpg",
      text: "Tradición y frescura en cada entrega. Haz tu pedido hoy y recíbelo directamente en tu hogar."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative h-[calc(100vh-88px)] md:h-[calc(100vh-96px)] w-full overflow-hidden bg-navy">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-navy/50 z-10 mix-blend-multiply" />
          <div className="absolute inset-0 bg-black/20 z-10" />
          <img 
            src={slides[currentSlide].image} 
            alt="Slide" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-cream text-2xl md:text-4xl lg:text-5xl font-serif max-w-4xl leading-tight font-light"
            >
              {slides[currentSlide].text}
            </motion.p>
            <motion.a
              href="#tienda"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-12 px-10 py-4 bg-gold text-navy font-semibold uppercase tracking-[0.2em] text-xs hover:bg-lightblue hover:text-white transition-all duration-500 shadow-lg"
            >
              Descubrir Colección
            </motion.a>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute z-30 bottom-12 left-0 right-0 flex justify-center space-x-4">
        {slides.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-[2px] transition-all duration-500 ${idx === currentSlide ? 'bg-cream w-12' : 'bg-cream/30 w-6'}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
      
      <button onClick={prevSlide} className="absolute z-30 left-4 md:left-12 top-1/2 -translate-y-1/2 text-cream/50 hover:text-cream transition-colors p-4">
        <ChevronLeft size={32} strokeWidth={1} />
      </button>
      <button onClick={nextSlide} className="absolute z-30 right-4 md:right-12 top-1/2 -translate-y-1/2 text-cream/50 hover:text-cream transition-colors p-4">
        <ChevronRight size={32} strokeWidth={1} />
      </button>
    </div>
  );
};

const WelcomeSection = () => {
  return (
    <section className="py-32 px-6 md:px-12 max-w-4xl mx-auto text-center">
      <h2 className="text-3xl md:text-5xl font-serif text-navy mb-8 leading-tight">
        Bienvenidos a PALBAU<br/>
        <span className="italic text-lightblue font-light text-2xl md:text-4xl mt-4 block">La excelencia en Lácteos y Embutidos.</span>
      </h2>
      <div className="w-12 h-[1px] bg-red mx-auto mb-12" />
      <p className="text-darkgray text-lg md:text-xl font-light leading-relaxed mb-10">
        Nos apasiona llevar a tu mesa una curaduría excepcional de productos que celebran el sabor real. Desde el corazón del campo hasta tu cocina, garantizamos calidad premium en cada selección.
      </p>
      <p className="text-darkgray/80 text-base md:text-lg font-light leading-relaxed">
        En PALBAU, somos especialistas en la distribución de lácteos y embutidos de la más alta calidad. Nos distinguimos por una selección rigurosa que incluye desde el tradicional Queso Oaxaca y Rancho hasta exclusivas piezas importadas como Manchego y Gouda. Nuestra misión es facilitar el acceso a productos gourmet con la comodidad de una compra digital y la calidez de una atención personalizada.
      </p>
    </section>
  );
};

const ValuesSection = () => {
  const values = [
    {
      title: "Selección Gourmet Curada",
      desc: "Solo trabajamos con productores que cumplen los más altos estándares de frescura y sabor.",
      icon: Award
    },
    {
      title: "Atención Personalizada",
      desc: "Tu pedido es gestionado directamente por nuestro equipo para asegurar que recibas exactamente lo que necesitas.",
      icon: HeartHandshake
    },
    {
      title: "Frescura Garantizada",
      desc: "Mantenemos una cadena de frío estricta para que cada producto llegue a tu hogar como si acabara de ser cortado.",
      icon: Snowflake
    }
  ];

  return (
    <section className="py-24 bg-navy text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 text-center">
          {values.map((val, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="w-16 h-16 border-2 border-lightblue rounded-full flex items-center justify-center mb-8 text-lightblue">
                <val.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-serif mb-4 uppercase tracking-[0.15em] text-gold">{val.title}</h3>
              <p className="text-white/80 font-light leading-relaxed text-sm md:text-base max-w-xs">
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturedCategories = () => {
  const categories = [
    {
      name: "Jamones Selectos",
      desc: "Variedad de jamones de pierna y pavo, con cortes precisos y texturas suaves, ideales para el consumo diario o eventos especiales.",
      image: "https://images.unsplash.com/photo-1603048297172-c92544798d5e?q=80&w=2070&auto=format&fit=crop"
    },
    {
      name: "Salchichas Premium",
      desc: "Elaboradas con recetas tradicionales, nuestras salchichas ofrecen la firmeza y el sabor especiado perfecto para parrilladas o desayunos.",
      image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=2070&auto=format&fit=crop"
    },
    {
      name: "Quesos Nacionales",
      desc: "Queso Oaxaca Tradicional y Queso Ranchero. Hechos con leche 100% pura, evocando la tradición del campo.",
      image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?q=80&w=2073&auto=format&fit=crop"
    },
    {
      name: "Quesos Importados",
      desc: "Manchego, Gouda y más. Una travesía por los sabores de Europa con diferentes meses de maduración y notas de nuez.",
      image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?q=80&w=2069&auto=format&fit=crop"
    }
  ];

  return (
    <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-xs uppercase tracking-[0.3em] text-red mb-4 font-semibold">Nuestra Colección</h2>
        <h3 className="text-4xl md:text-5xl font-serif text-navy mb-6">Categorías Destacadas</h3>
        <div className="w-12 h-[2px] bg-lightblue mx-auto" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {categories.map((cat, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.4 }}
            className="group cursor-pointer flex flex-col"
          >
            <div className="relative h-[450px] overflow-hidden mb-8">
              <img 
                src={cat.image} 
                alt={cat.name} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-navy/10 group-hover:bg-transparent transition-colors duration-500" />
            </div>
            <div className="text-center px-4">
              <h4 className="text-2xl font-serif text-navy mb-4">{cat.name}</h4>
              <p className="text-darkgray/80 font-light text-sm leading-relaxed mb-6 max-w-md mx-auto">
                {cat.desc}
              </p>
              <span className="inline-flex items-center text-xs uppercase tracking-[0.2em] text-lightblue font-bold group-hover:text-red transition-colors">
                Ver Productos <ChevronRight size={14} className="ml-2 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer id="contacto" className="bg-darkgray text-white pt-24 pb-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-20">
        <div className="md:col-span-5 lg:col-span-4">
          <div className="text-3xl font-serif font-semibold tracking-widest uppercase mb-6 text-gold">Palbau</div>
          <p className="text-white/70 font-light text-sm leading-relaxed max-w-sm">
            La excelencia en lácteos y embutidos. Calidad premium y frescura garantizada desde el campo hasta tu mesa.
          </p>
        </div>
        
        <div className="md:col-span-3 lg:col-span-2 lg:col-start-7">
          <h4 className="font-serif text-lg mb-6 uppercase tracking-[0.15em] text-lightblue">Enlaces</h4>
          <ul className="space-y-4 text-white/80 font-light text-sm">
            <li><a href="#" className="hover:text-gold transition-colors">Inicio</a></li>
            <li><a href="#tienda" className="hover:text-gold transition-colors">Tienda</a></li>
            <li><a href="#contacto" className="hover:text-gold transition-colors">Contacto</a></li>
          </ul>
        </div>
        
        <div className="md:col-span-4 lg:col-span-4">
          <h4 className="font-serif text-lg mb-6 uppercase tracking-[0.15em] text-lightblue">Contacto</h4>
          <ul className="space-y-4 text-white/80 font-light text-sm">
            <li>contacto@palbau.com</li>
            <li>+52 123 456 7890</li>
            <li className="pt-4">
              <button className="flex items-center justify-center space-x-3 bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3 rounded-sm transition-colors w-full sm:w-auto">
                <MessageCircle size={18} />
                <span className="uppercase tracking-wider text-xs font-medium">Atención por WhatsApp</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-white/50 text-xs font-light">
        <p>&copy; {new Date().getFullYear()} PALBAU. Todos los derechos reservados.</p>
        <p className="mt-4 md:mt-0">Diseño Minimalista & Premium</p>
      </div>
    </footer>
  );
};

const ProductsSection = () => {
  const { addToCart } = useCart();
  
  return (
    <section id="tienda" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-xs uppercase tracking-[0.3em] text-red mb-4 font-semibold">Nuestros Productos</h2>
        <h3 className="text-4xl font-serif text-navy mb-6">Selección Especial</h3>
        <div className="w-12 h-[2px] bg-lightblue mx-auto" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {productsData.map(product => (
          <div key={product.id} className="flex flex-col items-center text-center group">
            <Link to={`/producto/${product.id}`} className="w-full relative overflow-hidden mb-6">
              <img src={product.image} alt={product.name} className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105 rounded-md" />
            </Link>
            <Link to={`/producto/${product.id}`}>
              <h4 className="text-xl font-sans text-darkgray mb-2 hover:text-lightblue transition-colors">{product.name}</h4>
            </Link>
            <p className="text-[#85A854] font-light mb-6">${product.price.toFixed(2)}</p>
            <button 
              onClick={() => addToCart(product, 1)}
              className="px-6 py-2 border border-darkgray text-darkgray text-sm hover:bg-darkgray hover:text-white transition-colors"
            >
              Add to cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

const ProductPage = () => {
  const { id } = useParams();
  const product = productsData.find(p => p.id === Number(id));
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) return <div className="pt-40 text-center text-2xl">Producto no encontrado</div>;

  return (
    <div className="pt-[88px] md:pt-[96px] min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 bg-navy overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-40">
          <img src={product.image} alt="Background" className="w-full h-full object-cover blur-sm" />
        </div>
        <div className="absolute inset-0 bg-navy/60" />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-5xl font-serif text-white uppercase tracking-widest mb-4">{product.name}</h1>
          <div className="text-white/70 text-sm uppercase tracking-widest flex items-center justify-center space-x-2">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <Link to="/#tienda" className="hover:text-gold transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-white">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="rounded-md overflow-hidden shadow-xl">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          
          {/* Info */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-sans text-darkgray mb-4">{product.name}</h2>
            <p className="text-2xl text-[#85A854] font-light mb-8">${product.price.toFixed(2)}</p>
            <p className="text-darkgray/70 font-light leading-relaxed mb-10">
              {product.description}
            </p>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-darkgray hover:bg-gray-100 transition-colors">-</button>
                <input type="number" value={quantity} readOnly className="w-12 text-center py-3 outline-none text-darkgray font-medium" />
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 text-darkgray hover:bg-gray-100 transition-colors">+</button>
              </div>
              <button 
                onClick={() => addToCart(product, quantity)}
                className="px-8 py-3 bg-white border border-darkgray text-darkgray text-sm hover:bg-darkgray hover:text-white transition-colors"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-12">
          <div>
            <h3 className="text-xl font-serif text-navy mb-6">Search</h3>
            <div className="flex">
              <input type="text" placeholder="Search products..." className="flex-1 border border-gray-300 px-4 py-2 outline-none focus:border-lightblue transition-colors" />
              <button className="px-6 py-2 bg-gray-100 border border-l-0 border-gray-300 text-darkgray hover:bg-gray-200 transition-colors">Search</button>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-serif text-navy mb-6">Product categories</h3>
            <ul className="space-y-4 text-darkgray/70 font-light">
              <li className="border-b border-gray-100 pb-2 hover:text-lightblue cursor-pointer transition-colors">Quesos Nacionales</li>
              <li className="border-b border-gray-100 pb-2 hover:text-lightblue cursor-pointer transition-colors">Quesos Importados</li>
              <li className="border-b border-gray-100 pb-2 hover:text-lightblue cursor-pointer transition-colors">Jamones Selectos</li>
              <li className="border-b border-gray-100 pb-2 hover:text-lightblue cursor-pointer transition-colors">Salchichas Premium</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartModal = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, cartTotal } = useCart();

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;
    
    let message = "Hola! Me gustaría realizar el siguiente pedido:\n\n";
    cart.forEach(item => {
      message += `- ${item.quantity}x ${item.product.name} ($${(item.product.price * item.quantity).toFixed(2)})\n`;
    });
    message += `\n*Total: $${cartTotal.toFixed(2)}*`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/524431373266?text=${encodedMessage}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-serif text-navy">Tu Carrito</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-darkgray hover:text-red transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-darkgray/50">
                  <ShoppingCart size={48} className="mb-4 opacity-20" />
                  <p>Tu carrito está vacío</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex items-center space-x-4">
                      <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-md" />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-navy">{item.product.name}</h4>
                        <p className="text-sm text-darkgray/60">{item.quantity} x ${item.product.price.toFixed(2)}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.product.id)} className="text-red/60 hover:text-red p-2">
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-navy font-medium">Total:</span>
                  <span className="text-xl text-gold font-serif font-bold">${cartTotal.toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-medium uppercase tracking-widest text-sm flex items-center justify-center space-x-2 transition-colors rounded-sm shadow-md"
                >
                  <MessageCircle size={20} />
                  <span>Pedir por WhatsApp</span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const HomePage = () => (
  <>
    <HeroSlider />
    <WelcomeSection />
    <ValuesSection />
    <FeaturedCategories />
    <ProductsSection />
  </>
);

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <CartProvider>
        <div className="min-h-screen bg-cream selection:bg-gold/30 selection:text-navy flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/producto/:id" element={<ProductPage />} />
            </Routes>
          </main>
          <Footer />
          <CartModal />
        </div>
      </CartProvider>
    </Router>
  );
}
