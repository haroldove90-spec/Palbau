/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, createContext, useContext, Component, ReactNode, ErrorInfo } from 'react';
import { ShoppingCart, Menu, X, ChevronRight, ChevronLeft, MessageCircle, Award, HeartHandshake, Snowflake, Home, Store, Phone, Shield, MapPin, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { Product, ProductProvider, useProducts } from './context/ProductContext';
import { OrderProvider, useOrders } from './context/OrderContext';
import { UserProvider } from './context/UserContext';
import { CategoryProvider, useCategories } from './context/CategoryContext';
import { AdminRoutes } from './pages/Admin';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);
  return null;
};

// --- Context ---
type CartItem = {
  product: Product;
  quantity: number;
};

const CartContext = createContext<{
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
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

  const addToCart = (product: Product, quantity: number) => {
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
          <Link to="/productos" className="text-xs uppercase tracking-[0.2em] text-navy transition-colors hover:text-lightblue">Tienda</Link>
          <Link to="/#contacto" className="text-xs uppercase tracking-[0.2em] text-navy transition-colors hover:text-lightblue">Contacto</Link>
          <Link to="/admin" className="text-xs uppercase tracking-[0.2em] text-gold font-bold transition-colors hover:text-lightblue">Admin</Link>
        </nav>

        {/* Cart */}
        <button onClick={() => setIsCartOpen(true)} className="relative text-navy transition-colors hover:text-lightblue">
          <ShoppingCart size={22} strokeWidth={1.5} />
          <AnimatePresence>
            {cartCount > 0 && (
              <motion.span 
                key={cartCount}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ duration: 0.3 }}
                exit={{ scale: 0 }}
                className="absolute -top-2 -right-2 bg-[#C11E21] text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-bold shadow-sm z-10"
              >
                {cartCount}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-cream z-50 flex flex-col p-6 overflow-hidden"
          >
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-lightblue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

            <div className="flex justify-between items-center mb-12 relative z-10">
              <img 
                src="https://appdesignproyectos.com/palbau.png" 
                alt="PALBAU" 
                className="h-12 object-contain"
                referrerPolicy="no-referrer"
              />
              <button 
                onClick={() => setMobileMenuOpen(false)} 
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-navy shadow-sm border border-gray-100 active:scale-90 transition-transform"
              >
                <X size={24} strokeWidth={2} />
              </button>
            </div>
            
            <nav className="flex flex-col space-y-4 relative z-10">
              <Link 
                to="/" 
                className="group flex items-center space-x-4 p-4 rounded-2xl bg-white shadow-sm border border-gray-100 active:scale-95 transition-all" 
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="w-12 h-12 rounded-xl bg-lightblue/10 text-lightblue flex items-center justify-center group-hover:bg-lightblue group-hover:text-white transition-colors">
                  <Home size={24} strokeWidth={1.5} />
                </div>
                <span className="text-xl font-serif text-navy font-medium">Inicio</span>
              </Link>
              
              <Link 
                to="/productos" 
                className="group flex items-center space-x-4 p-4 rounded-2xl bg-white shadow-sm border border-gray-100 active:scale-95 transition-all" 
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="w-12 h-12 rounded-xl bg-red/10 text-red flex items-center justify-center group-hover:bg-red group-hover:text-white transition-colors">
                  <Store size={24} strokeWidth={1.5} />
                </div>
                <span className="text-xl font-serif text-navy font-medium">Tienda</span>
              </Link>
              
              <Link 
                to="/#contacto" 
                className="group flex items-center space-x-4 p-4 rounded-2xl bg-white shadow-sm border border-gray-100 active:scale-95 transition-all" 
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="w-12 h-12 rounded-xl bg-navy/10 text-navy flex items-center justify-center group-hover:bg-navy group-hover:text-white transition-colors">
                  <Phone size={24} strokeWidth={1.5} />
                </div>
                <span className="text-xl font-serif text-navy font-medium">Contacto</span>
              </Link>
              
              <Link 
                to="/admin" 
                className="group flex items-center space-x-4 p-4 rounded-2xl bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/20 active:scale-95 transition-all mt-4" 
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="w-12 h-12 rounded-xl bg-gold text-white flex items-center justify-center shadow-md shadow-gold/20">
                  <Shield size={24} strokeWidth={1.5} />
                </div>
                <span className="text-xl font-serif text-navy font-bold">Admin</span>
              </Link>
            </nav>
            
            <div className="mt-auto text-center pb-8 relative z-10">
              <div className="w-16 h-1 bg-gray-200 mx-auto rounded-full mb-6"></div>
              <p className="text-navy/50 text-sm font-light uppercase tracking-widest">La excelencia en</p>
              <p className="text-navy font-serif text-lg mt-1">Lácteos y Embutidos</p>
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
  const { categories } = useCategories();

  return (
    <section className="py-32 px-4 md:px-12 max-w-7xl mx-auto">
      <div className="text-center mb-12 md:mb-20">
        <h2 className="text-xs uppercase tracking-[0.3em] text-red mb-4 font-semibold">Nuestra Colección</h2>
        <h3 className="text-3xl md:text-5xl font-serif text-navy mb-6">Categorías Destacadas</h3>
        <div className="w-12 h-[2px] bg-lightblue mx-auto" />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-10 lg:gap-16">
        {categories.map((cat, idx) => (
          <motion.div 
            key={cat.id || idx}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.4 }}
            className="group cursor-pointer flex flex-col"
          >
            <div className="relative h-48 md:h-[450px] overflow-hidden mb-4 md:mb-8">
              <img 
                src={cat.image} 
                alt={cat.name} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-navy/10 group-hover:bg-transparent transition-colors duration-500" />
            </div>
            <div className="text-center px-2 md:px-4">
              <h4 className="text-lg md:text-2xl font-serif text-navy mb-2 md:mb-4">{cat.name}</h4>
              <p className="text-darkgray/80 font-light text-xs md:text-sm leading-relaxed mb-4 md:mb-6 max-w-md mx-auto line-clamp-3 md:line-clamp-none">
                {cat.description}
              </p>
              <Link to={`/productos?categoria=${encodeURIComponent(cat.name)}`} className="inline-flex items-center text-[10px] md:text-xs uppercase tracking-[0.2em] text-lightblue font-bold group-hover:text-red transition-colors">
                Ver Productos <ChevronRight size={14} className="ml-1 md:ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-darkgray text-white pt-24 pb-12 px-6 md:px-12">
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
        <div className="mt-4 md:mt-0 flex items-center space-x-6">
          <p>Diseño Minimalista & Premium</p>
          <Link to="/admin" className="hover:text-gold transition-colors">Acceso Admin</Link>
        </div>
      </div>
    </footer>
  );
};

const ProductsSection = () => {
  const { addToCart } = useCart();
  const { products } = useProducts();
  
  // Duplicamos los productos para el efecto de scroll infinito
  const displayProducts = [...products, ...products];
  
  return (
    <section id="tienda" className="py-24 px-4 md:px-12 max-w-7xl mx-auto overflow-hidden">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-xs uppercase tracking-[0.3em] text-red mb-4 font-semibold">Nuestros Productos</h2>
        <h3 className="text-3xl md:text-4xl font-serif text-navy mb-6">Productos nuevos</h3>
        <div className="w-12 h-[2px] bg-lightblue mx-auto" />
      </div>
      
      <div className="relative group">
        <motion.div 
          animate={{ x: [0, "-50%"] }}
          transition={{ 
            duration: products.length * 3, 
            repeat: Infinity, 
            ease: "linear",
            repeatType: "loop"
          }}
          className="flex space-x-4 md:space-x-8 pb-8"
          style={{ width: "fit-content" }}
        >
          {displayProducts.map((product, idx) => (
            <div key={`${product.id}-${idx}`} className="flex-shrink-0 w-64 md:w-72 flex flex-col items-center text-center group/item">
              <Link to={`/producto/${product.id}`} className="w-full relative overflow-hidden mb-4 md:mb-6">
                <img src={product.image} alt={product.name} className="w-full h-40 md:h-64 object-cover transition-transform duration-700 group-hover/item:scale-105 rounded-md" />
              </Link>
              <Link to={`/producto/${product.id}`}>
                <h4 className="text-sm md:text-xl font-sans text-darkgray mb-1 md:mb-2 hover:text-lightblue transition-colors">{product.name}</h4>
              </Link>
              <p className="text-[#85A854] font-light text-sm md:text-base mb-4 md:mb-6">${product.price.toFixed(2)}</p>
              <button 
                onClick={() => addToCart(product, 1)}
                className="px-3 md:px-6 py-2 border border-darkgray text-darkgray text-xs md:text-sm hover:bg-darkgray hover:text-white transition-colors w-full"
              >
                Añadir al carrito
              </button>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="mt-12 text-center">
        <Link 
          to="/productos" 
          className="inline-flex items-center px-8 py-4 bg-navy text-white text-xs uppercase tracking-[0.2em] font-bold hover:bg-gold transition-all duration-300 shadow-lg hover:shadow-gold/20"
        >
          Ver más productos
          <ChevronRight size={16} className="ml-2" />
        </Link>
      </div>
    </section>
  );
};

const ProductPage = () => {
  const { id } = useParams();
  const { products } = useProducts();
  const { categories } = useCategories();
  const product = products.find(p => p.id === Number(id));
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

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
            <Link to="/" className="hover:text-gold transition-colors">Inicio</Link>
            <span>/</span>
            <Link to="/#tienda" className="hover:text-gold transition-colors">Tienda</Link>
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
                Añadir al carrito
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-12">
          <div>
            <h3 className="text-xl font-serif text-navy mb-6">Buscar</h3>
            <div className="flex">
              <input type="text" placeholder="Buscar productos..." className="flex-1 border border-gray-300 px-4 py-2 outline-none focus:border-lightblue transition-colors" />
              <button className="px-6 py-2 bg-gray-100 border border-l-0 border-gray-300 text-darkgray hover:bg-gray-200 transition-colors">Buscar</button>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-serif text-navy mb-6">Categorías de productos</h3>
            <ul className="space-y-4 text-darkgray/70 font-light">
              {categories.map(cat => (
                <li 
                  key={cat.id} 
                  onClick={() => navigate(`/productos?categoria=${encodeURIComponent(cat.name)}`)}
                  className="border-b border-gray-100 pb-2 hover:text-lightblue cursor-pointer transition-colors"
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartModal = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, cartTotal } = useCart();
  const { createOrder } = useOrders();
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleWhatsAppCheckout = async () => {
    if (cart.length === 0) return;
    if (!customerName.trim()) {
      alert('Por favor, ingresa tu nombre para continuar.');
      return;
    }
    if (!customerAddress.trim()) {
      alert('Por favor, ingresa tu ubicación para la entrega.');
      return;
    }
    
    try {
      setIsProcessing(true);

      // 1. Save to Supabase
      const orderData = {
        customer_name: customerName,
        customer_address: customerAddress,
        total: cartTotal
      };

      const orderItems = cart.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      }));

      await createOrder(orderData, orderItems);

      // 2. Prepare WhatsApp message
      let message = `Hola! Soy *${customerName}*.\n`;
      message += `Ubicación de entrega: ${customerAddress}\n\n`;
      message += "Me gustaría realizar el siguiente pedido:\n\n";
      cart.forEach(item => {
        message += `- ${item.quantity}x ${item.product.name} ($${(item.product.price * item.quantity).toFixed(2)})\n`;
      });
      message += `\n*Total: $${cartTotal.toFixed(2)}*`;
      
      const encodedMessage = encodeURIComponent(message);
      
      // 3. Open WhatsApp
      window.open(`https://wa.me/524431373266?text=${encodedMessage}`, '_blank');
      
      // 4. Close cart (optional: clear cart)
      setIsCartOpen(false);
      // Note: You might want to clear the cart here too if useCart supports it
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Hubo un error al procesar tu pedido. Por favor intenta de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getRealLocation = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización.');
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCustomerAddress(`https://www.google.com/maps?q=${latitude},${longitude}`);
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('No se pudo obtener tu ubicación. Por favor, ingrésala manualmente.');
        setIsLoadingLocation(false);
      }
    );
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
            className="fixed top-0 right-0 h-[100dvh] w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
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
              <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
                <div className="space-y-3">
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-darkgray/40" />
                    <input 
                      type="text" 
                      placeholder="Tu nombre completo" 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-sm text-sm outline-none focus:border-lightblue transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-darkgray/40" />
                    <input 
                      type="text" 
                      placeholder="Dirección o ubicación real" 
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-sm text-sm outline-none focus:border-lightblue transition-colors"
                    />
                    <button 
                      onClick={getRealLocation}
                      disabled={isLoadingLocation}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-lightblue hover:bg-lightblue/10 rounded-full transition-colors disabled:opacity-50"
                      title="Obtener mi ubicación real"
                    >
                      <MapPin size={16} className={isLoadingLocation ? 'animate-pulse' : ''} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-navy font-medium">Total:</span>
                  <span className="text-xl text-gold font-serif font-bold">${cartTotal.toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleWhatsAppCheckout}
                  disabled={isProcessing}
                  className="w-full py-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-medium uppercase tracking-widest text-sm flex items-center justify-center space-x-2 transition-colors rounded-sm shadow-md disabled:opacity-50"
                >
                  <MessageCircle size={20} />
                  <span>{isProcessing ? 'Procesando...' : 'Pedir por WhatsApp'}</span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ContactSection = () => {
  return (
    <section id="contacto" className="py-24 px-6 md:px-12 max-w-7xl mx-auto bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-xs uppercase tracking-[0.3em] text-red mb-4 font-semibold">Contacto</h2>
          <h3 className="text-4xl font-serif text-navy mb-6">¿Tienes alguna duda o pedido especial?</h3>
          <div className="w-12 h-[2px] bg-lightblue mb-8" />
          <p className="text-darkgray/70 font-light leading-relaxed mb-8">
            Ponte en contacto con nosotros. Estamos aquí para ayudarte a seleccionar los mejores productos para tu mesa o evento. Llena el formulario y te responderemos a la brevedad.
          </p>
          <div className="space-y-4 text-darkgray">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-full text-lightblue">
                <MessageCircle size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-navy">WhatsApp / Teléfono</p>
                <p className="text-sm font-light">+52 443 137 3266</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-full text-lightblue">
                <Award size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-navy">Correo Electrónico</p>
                <p className="text-sm font-light">contacto@palbau.com</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-8 rounded-sm">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs uppercase tracking-wider text-navy mb-2">Nombre Completo</label>
              <input type="text" placeholder="Ej. Juan Pérez" className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-lightblue transition-colors bg-white" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-navy mb-2">Correo Electrónico</label>
                <input type="email" placeholder="ejemplo@correo.com" className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-lightblue transition-colors bg-white" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-navy mb-2">Teléfono</label>
                <input type="tel" placeholder="Tu número" className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-lightblue transition-colors bg-white" />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-navy mb-2">Mensaje</label>
              <textarea rows={4} placeholder="¿En qué podemos ayudarte?" className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-lightblue transition-colors bg-white resize-none"></textarea>
            </div>
            <button className="w-full py-4 bg-navy text-white text-sm uppercase tracking-widest hover:bg-lightblue transition-colors">
              Enviar Mensaje
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

const ProductsPage = () => {
  const { products } = useProducts();
  const { categories } = useCategories();
  const { addToCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const categoryFilter = searchParams.get('categoria');

  const filteredProducts = categoryFilter 
    ? products.filter(p => p.category === categoryFilter)
    : products;

  return (
    <div className="pt-[88px] md:pt-[96px] min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-navy py-16 px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-serif text-white mb-4">
          {categoryFilter ? categoryFilter : 'Todos los Productos'}
        </h1>
        <div className="w-12 h-[2px] bg-gold mx-auto mb-6" />
        <p className="text-white/70 font-light max-w-2xl mx-auto">
          Explora nuestra selección premium de lácteos y embutidos, curados especialmente para los paladares más exigentes.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white p-6 rounded-sm shadow-sm">
            <h3 className="text-lg font-serif text-navy mb-6 border-b pb-2">Categorías</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => navigate('/productos')}
                  className={`text-sm hover:text-lightblue transition-colors ${!categoryFilter ? 'text-lightblue font-bold' : 'text-darkgray/70'}`}
                >
                  Todos los Productos
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <button 
                    onClick={() => navigate(`/productos?categoria=${encodeURIComponent(cat.name)}`)}
                    className={`text-sm hover:text-lightblue transition-colors text-left ${categoryFilter === cat.name ? 'text-lightblue font-bold' : 'text-darkgray/70'}`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-9">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <div key={product.id} className="flex flex-col items-center text-center group bg-white p-4 rounded-sm shadow-sm hover:shadow-md transition-shadow">
                  <Link to={`/producto/${product.id}`} className="w-full relative overflow-hidden mb-4 md:mb-6">
                    <img src={product.image} alt={product.name} className="w-full h-40 md:h-56 object-cover transition-transform duration-700 group-hover:scale-105 rounded-sm" />
                  </Link>
                  <Link to={`/producto/${product.id}`}>
                    <h4 className="text-sm md:text-lg font-sans text-darkgray mb-1 md:mb-2 hover:text-lightblue transition-colors">{product.name}</h4>
                  </Link>
                  <p className="text-[#85A854] font-light text-sm md:text-base mb-4 md:mb-6">${product.price.toFixed(2)}</p>
                  <button 
                    onClick={() => addToCart(product, 1)}
                    className="px-3 md:px-6 py-2 border border-darkgray text-darkgray text-xs md:text-sm hover:bg-darkgray hover:text-white transition-colors w-full"
                  >
                    Añadir al carrito
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-darkgray/50">
                <p className="text-xl">No se encontraron productos en esta categoría.</p>
                <Link to="/productos" className="inline-block mt-6 px-6 py-2 border border-navy text-navy hover:bg-navy hover:text-white transition-colors">
                  Ver todos los productos
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => (
  <>
    <HeroSlider />
    <WelcomeSection />
    <ValuesSection />
    <FeaturedCategories />
    <ProductsSection />
    <ContactSection />
  </>
);

// --- Error Boundary ---
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-white p-8 rounded-2xl shadow-xl border border-red/10">
            <div className="w-16 h-16 bg-red/10 text-red rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield size={32} />
            </div>
            <h1 className="text-2xl font-serif text-navy mb-4">Algo salió mal</h1>
            <p className="text-darkgray/70 mb-6 font-light">
              Lo sentimos, ha ocurrido un error inesperado. Por favor, intenta recargar la página o contacta con soporte si el problema persiste.
            </p>
            {import.meta.env.DEV && (
              <div className="text-left bg-gray-50 p-4 rounded-lg mb-6 overflow-auto max-h-40 text-xs font-mono text-red">
                {this.state.error?.message}
              </div>
            )}
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-navy text-white text-sm uppercase tracking-widest hover:bg-lightblue transition-colors rounded-sm"
            >
              Recargar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <ProductProvider>
          <CategoryProvider>
            <OrderProvider>
              <UserProvider>
                <CartProvider>
                  <Routes>
                    <Route path="/admin/*" element={<AdminRoutes />} />
                    <Route path="*" element={
                      <div className="min-h-screen bg-cream selection:bg-gold/30 selection:text-navy flex flex-col">
                        <Header />
                        <main className="flex-1">
                          <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/productos" element={<ProductsPage />} />
                            <Route path="/producto/:id" element={<ProductPage />} />
                          </Routes>
                        </main>
                        <Footer />
                        <CartModal />
                      </div>
                    } />
                  </Routes>
                </CartProvider>
              </UserProvider>
            </OrderProvider>
          </CategoryProvider>
        </ProductProvider>
      </Router>
    </ErrorBoundary>
  );
}
