import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { LayoutDashboard, PackagePlus, DollarSign, ShoppingBag, TrendingUp, PlusCircle, LogOut, ClipboardList, UploadCloud, X, Menu, Home, Eye, EyeOff, ExternalLink, Trash2, Shield, Users, UserPlus, CheckCircle2, Clock, Package, AlertCircle, Tags, Lock, Key, Mail, Plus, LifeBuoy, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { Product, useProducts } from '../context/ProductContext';
import { useOrders, Order } from '../context/OrderContext';
import { useUsers, UserProfile } from '../context/UserContext';
import { useCategories, Category } from '../context/CategoryContext';

const mockSalesData = [
  { time: '08:00', sales: 120 },
  { time: '10:00', sales: 300 },
  { time: '12:00', sales: 450 },
  { time: '14:00', sales: 200 },
  { time: '16:00', sales: 600 },
  { time: '18:00', sales: 800 },
  { time: '20:00', sales: 500 },
];

const mockCategoryData = [
  { name: 'Quesos', value: 400 },
  { name: 'Jamones', value: 300 },
  { name: 'Salchichas', value: 200 },
  { name: 'Embutidos', value: 278 },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
      window.location.href = '/';
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  const isSupabaseConfigured = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Configuration Warning */}
      {!isSupabaseConfigured && (
        <div className="fixed top-0 left-0 right-0 bg-red text-white py-2 px-4 z-[100] text-center text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-2">
          <Shield size={14} />
          <span>Error: Supabase no está configurado. Revisa las variables de entorno en Vercel.</span>
        </div>
      )}

      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <img 
            src="https://appdesignproyectos.com/palbau.png" 
            alt="PALBAU" 
            className="h-8 object-contain"
            referrerPolicy="no-referrer"
          />
          <div className="h-6 w-px bg-gray-200"></div>
          <span className="text-xs font-bold text-gold uppercase tracking-widest">Admin</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)} 
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-navy shadow-sm border border-gray-100 active:scale-90 transition-transform"
        >
          <Menu size={20} strokeWidth={2} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-cream z-50 flex flex-col p-6 overflow-hidden md:hidden"
          >
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-navy/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

            <div className="flex justify-between items-center mb-12 relative z-10">
              <div className="flex items-center space-x-3">
                <img 
                  src="https://appdesignproyectos.com/palbau.png" 
                  alt="PALBAU" 
                  className="h-10 object-contain"
                  referrerPolicy="no-referrer"
                />
                <div className="h-8 w-px bg-gray-300"></div>
                <span className="text-sm font-bold text-gold uppercase tracking-widest">Admin</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-navy shadow-sm border border-gray-100 active:scale-90 transition-transform"
              >
                <X size={24} strokeWidth={2} />
              </button>
            </div>
            
            <nav className="flex flex-col space-y-4 relative z-10">
              <Link 
                to="/admin/ventas" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`group flex items-center space-x-4 p-4 rounded-2xl bg-white shadow-sm border border-gray-100 active:scale-95 transition-all ${location.pathname.includes('/ventas') ? 'ring-2 ring-gold/50' : ''}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${location.pathname.includes('/ventas') ? 'bg-gold text-white shadow-md shadow-gold/20' : 'bg-gold/10 text-gold group-hover:bg-gold group-hover:text-white'}`}>
                  <LayoutDashboard size={24} strokeWidth={1.5} />
                </div>
                <span className="text-xl font-serif text-navy font-medium">Ventas y Métricas</span>
              </Link>
              
              <Link 
                to="/admin/pedidos" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`group flex items-center space-x-4 p-4 rounded-2xl bg-white shadow-sm border border-gray-100 active:scale-95 transition-all ${location.pathname.includes('/pedidos') ? 'ring-2 ring-lightblue/50' : ''}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${location.pathname.includes('/pedidos') ? 'bg-lightblue text-white shadow-md shadow-lightblue/20' : 'bg-lightblue/10 text-lightblue group-hover:bg-lightblue group-hover:text-white'}`}>
                  <ClipboardList size={24} strokeWidth={1.5} />
                </div>
                <span className="text-xl font-serif text-navy font-medium">Pedidos Recientes</span>
              </Link>

              <Link 
                to="/admin/usuarios" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`group flex items-center space-x-4 p-4 rounded-2xl bg-white shadow-sm border border-gray-100 active:scale-95 transition-all ${location.pathname.includes('/usuarios') ? 'ring-2 ring-gold/50' : ''}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${location.pathname.includes('/usuarios') ? 'bg-gold text-white shadow-md shadow-gold/20' : 'bg-gold/10 text-gold group-hover:bg-gold group-hover:text-white'}`}>
                  <Users size={24} strokeWidth={1.5} />
                </div>
                <span className="text-xl font-serif text-navy font-medium">Gestión de Usuarios</span>
              </Link>
              
              <Link 
                to="/admin/productos" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`group flex items-center space-x-4 p-4 rounded-2xl bg-white shadow-sm border border-gray-100 active:scale-95 transition-all ${location.pathname.includes('/productos') ? 'ring-2 ring-navy/50' : ''}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${location.pathname.includes('/productos') ? 'bg-navy text-white shadow-md shadow-navy/20' : 'bg-navy/10 text-navy group-hover:bg-navy group-hover:text-white'}`}>
                  <PackagePlus size={24} strokeWidth={1.5} />
                </div>
                <span className="text-xl font-serif text-navy font-medium">Gestión de Productos</span>
              </Link>

              <Link 
                to="/admin/categorias" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`group flex items-center space-x-4 p-4 rounded-2xl bg-white shadow-sm border border-gray-100 active:scale-95 transition-all ${location.pathname.includes('/categorias') ? 'ring-2 ring-gold/50' : ''}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${location.pathname.includes('/categorias') ? 'bg-gold text-white shadow-md shadow-gold/20' : 'bg-gold/10 text-gold group-hover:bg-gold group-hover:text-white'}`}>
                  <Tags size={24} strokeWidth={1.5} />
                </div>
                <span className="text-xl font-serif text-navy font-medium">Gestión de Categorías</span>
              </Link>
              
              <Link 
                to="/admin/ayuda" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`group flex items-center space-x-4 p-4 rounded-2xl bg-white shadow-sm border border-gray-100 active:scale-95 transition-all ${location.pathname.includes('/ayuda') ? 'ring-2 ring-gold/50' : ''}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${location.pathname.includes('/ayuda') ? 'bg-red text-white shadow-md shadow-red/20' : 'bg-red/10 text-red group-hover:bg-red group-hover:text-white'}`}>
                  <LifeBuoy size={24} strokeWidth={1.5} />
                </div>
                <span className="text-xl font-serif text-navy font-medium">Ayuda Técnica</span>
              </Link>
              
              <div className="h-px bg-gray-200 my-4"></div>

              <a 
                href="/" 
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-4 p-4 rounded-2xl bg-white shadow-sm border border-gray-100 active:scale-95 transition-all" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-12 h-12 rounded-xl bg-lightblue/10 text-lightblue flex items-center justify-center group-hover:bg-lightblue group-hover:text-white transition-colors">
                  <ExternalLink size={24} strokeWidth={1.5} />
                </div>
                <span className="text-xl font-serif text-navy font-medium">Visitar Tienda</span>
              </a>
              
              <button 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="group flex items-center space-x-4 p-4 rounded-2xl bg-white shadow-sm border border-gray-100 active:scale-95 transition-all disabled:opacity-50"
              >
                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                  <LogOut size={24} strokeWidth={1.5} />
                </div>
                <span className="text-xl font-serif text-navy font-medium">{isLoggingOut ? 'Cerrando...' : 'Cerrar Sesión'}</span>
              </button>
            </nav>
            
            <div className="mt-auto text-center pb-8 relative z-10">
              <div className="w-16 h-1 bg-gray-200 mx-auto rounded-full mb-6"></div>
              <p className="text-navy/50 text-sm font-light uppercase tracking-widest">Panel de Administración</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-navy text-white flex-col sticky top-0 h-screen z-40">
        <div className="hidden md:block p-6 border-b border-white/10">
          <h2 className="text-2xl font-serif text-gold tracking-widest uppercase">Palbau</h2>
          <p className="text-xs text-white/50 mt-1 uppercase tracking-widest">Panel de Control</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <a 
            href="/" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-white/10 text-white/80 transition-colors mb-4 border border-white/10 bg-white/5"
          >
            <ExternalLink size={20} />
            <span className="font-medium">Visitar Tienda</span>
          </a>
          <Link 
            to="/admin/ventas" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${location.pathname.includes('/ventas') ? 'bg-lightblue text-navy font-medium' : 'hover:bg-white/10 text-white/80'}`}
          >
            <LayoutDashboard size={20} />
            <span>Ventas y Métricas</span>
          </Link>
          <Link 
            to="/admin/pedidos" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${location.pathname.includes('/pedidos') ? 'bg-lightblue text-navy font-medium' : 'hover:bg-white/10 text-white/80'}`}
          >
            <ClipboardList size={20} />
            <span>Pedidos Recientes</span>
          </Link>
          <Link 
            to="/admin/usuarios" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${location.pathname.includes('/usuarios') ? 'bg-lightblue text-navy font-medium' : 'hover:bg-white/10 text-white/80'}`}
          >
            <Users size={20} />
            <span>Gestión de Usuarios</span>
          </Link>
          <Link 
            to="/admin/productos" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${location.pathname.includes('/productos') ? 'bg-lightblue text-navy font-medium' : 'hover:bg-white/10 text-white/80'}`}
          >
            <PackagePlus size={20} />
            <span>Gestión de Productos</span>
          </Link>
          <Link 
            to="/admin/categorias" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${location.pathname.includes('/categorias') ? 'bg-lightblue text-navy font-medium' : 'hover:bg-white/10 text-white/80'}`}
          >
            <Tags size={20} />
            <span>Gestión de Categorías</span>
          </Link>
          <Link 
            to="/admin/ayuda" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${location.pathname.includes('/ayuda') ? 'bg-red/20 text-red-100 font-medium' : 'hover:bg-white/10 text-white/80'}`}
          >
            <LifeBuoy size={20} />
            <span>Ayuda Técnica</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10 mt-auto">
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-white/10 text-white/80 transition-colors disabled:opacity-50"
          >
            <LogOut size={20} />
            <span>{isLoggingOut ? 'Cerrando...' : 'Cerrar Sesión'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

const AdminSales = () => {
  const { orders, loading } = useOrders();

  // Metrics calculations
  const totalSales = orders
    .filter(o => o.status === 'entregado' || o.status === 'en proceso')
    .reduce((acc, o) => acc + o.total, 0);

  const completedOrders = orders.filter(o => o.status === 'entregado').length;
  
  const averageTicket = completedOrders > 0 ? totalSales / orders.filter(o => o.status !== 'cancelado').length : 0;

  // Process data for charts
  const salesByStatus = [
    { name: 'Pendiente', value: orders.filter(o => o.status === 'pendiente').reduce((acc, o) => acc + o.total, 0) },
    { name: 'En Proceso', value: orders.filter(o => o.status === 'en proceso').reduce((acc, o) => acc + o.total, 0) },
    { name: 'Entregado', value: orders.filter(o => o.status === 'entregado').reduce((acc, o) => acc + o.total, 0) },
    { name: 'Cancelado', value: orders.filter(o => o.status === 'cancelado').reduce((acc, o) => acc + o.total, 0) },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h1 className="text-3xl font-serif text-navy mb-1 tracking-tight">Resumen de Ventas</h1>
        <p className="text-darkgray/60 text-sm">Métricas y rendimiento de tu tienda basadas en pedidos reales.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 font-light">Calculando métricas...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-5 transition-all hover:shadow-md">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shadow-inner">
                <DollarSign size={28} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black mb-1">Ventas Reales</p>
                <p className="text-3xl font-black text-navy tracking-tighter">${totalSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                <p className="text-[10px] text-green-600 font-bold mt-1">Órdenes Activas/Entregadas</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-5 transition-all hover:shadow-md">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                <ShoppingBag size={28} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black mb-1">Pedidos Entregados</p>
                <p className="text-3xl font-black text-navy tracking-tighter">{completedOrders}</p>
                <p className="text-[10px] text-blue-600 font-bold mt-1">Meta cumplida</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-5 transition-all hover:shadow-md">
              <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shadow-inner">
                <TrendingUp size={28} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black mb-1">Ticket Promedio</p>
                <p className="text-3xl font-black text-navy tracking-tighter">${averageTicket.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                <p className="text-[10px] text-orange-600 font-bold mt-1">Por pedido válido</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-navy mb-8 flex items-center">
                <div className="w-2 h-2 bg-navy rounded-full mr-3"></div>
                Ventas por Estado del Pedido
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesByStatus}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#999', fontSize: 10, fontWeight: 700}} 
                      dy={15} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#999', fontSize: 10}} 
                      dx={-10} 
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }}
                      cursor={{fill: '#f8f9fa', radius: 4}}
                      formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Monto Total']}
                    />
                    <Bar dataKey="value" fill="#1A2B4C" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-navy mb-8 flex items-center">
                <div className="w-2 h-2 bg-gold rounded-full mr-3"></div>
                Volumen de Pedidos Recientes
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={orders.slice(0, 10).reverse()}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="id" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#999', fontSize: 10}} 
                      dy={15}
                      tickFormatter={(val) => `#${val}`}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#999', fontSize: 10}} 
                      dx={-10} 
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }}
                      formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Total']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#85A854" 
                      strokeWidth={4} 
                      dot={{r: 5, fill: '#85A854', strokeWidth: 2, stroke: '#fff'}} 
                      activeDot={{r: 8, strokeWidth: 0}} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { categories } = useCategories();
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [lastAddedProduct, setLastAddedProduct] = useState<any>(null);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [imageWarnings, setImageWarnings] = useState<{main?: string, secondary?: string[]}>({});
  
  const processImage = (file: File, targetSize: number = 1200): Promise<{url: string, warning?: string}> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let warning = undefined;
          if (img.width < 400 || img.height < 400) {
            warning = 'La imagen es un poco pequeña, podría verse borrosa.';
          } else if (img.width > 4000 || img.height > 4000) {
            warning = 'La imagen es muy grande, la hemos optimizado para la web.';
          }

          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > targetSize) {
              height *= targetSize / width;
              width = targetSize;
            }
          } else {
            if (height > targetSize) {
              width *= targetSize / height;
              height = targetSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          resolve({
            url: canvas.toDataURL('image/jpeg', 0.8),
            warning
          });
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Quesos Nacionales',
    price: '',
    stock: '0',
    is_active: true,
    image: '',
    secondaryImages: [] as string[]
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const { url, warning } = await processImage(file);
      setFormData(prev => ({ ...prev, image: url }));
      setImageWarnings(prev => ({ ...prev, main: warning }));
    }
  };

  const handleSecondaryImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    const processed = await Promise.all(files.map(file => processImage(file)));
    
    setFormData(prev => ({ 
      ...prev, 
      secondaryImages: [...prev.secondaryImages, ...processed.map(p => p.url)] 
    }));

    setImageWarnings(prev => ({ 
      ...prev, 
      secondary: [...(prev.secondary || []), ...processed.map(p => p.warning || '')] 
    }));
  };

  const removeSecondaryImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      secondaryImages: prev.secondaryImages.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.price || !formData.image) {
      setError('Por favor, completa los campos obligatorios: Nombre, Precio e Imagen Principal.');
      return;
    }
    
    const finalCategory = isCustomCategory ? customCategory : formData.category;
    if (!finalCategory) {
      setError('Por favor, selecciona o escribe una categoría.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingProduct) {
        const updated = await updateProduct(editingProduct.id, {
          name: formData.name,
          description: formData.description,
          category: finalCategory,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          is_active: formData.is_active,
          image: formData.image,
          secondaryImages: formData.secondaryImages
        });
        
        setEditingProduct(null);
        setIsAdding(false);
        setFormData({ name: '', description: '', category: 'Quesos Nacionales', price: '', stock: '0', is_active: true, image: '', secondaryImages: [] });
        setIsCustomCategory(false);
        setCustomCategory('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const newProduct = await addProduct({
          name: formData.name,
          description: formData.description,
          category: finalCategory,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          is_active: formData.is_active,
          image: formData.image,
          secondaryImages: formData.secondaryImages
        });
        
        setLastAddedProduct(newProduct);
        setFormData({ name: '', description: '', category: 'Quesos Nacionales', price: '', stock: '0', is_active: true, image: '', secondaryImages: [] });
        setIsCustomCategory(false);
        setCustomCategory('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      console.error(err);
      let message = 'Ocurrió un error inesperado.';
      
      if (err.message) {
        message = err.message;
        if (err.message.includes('recursion')) {
          message = 'Error crítico de recursión en Supabase. Ve a la sección "Ayuda/Soporte" para corregirlo con un comando SQL.';
        }
        if (err.message.includes('column') || err.message.includes('stock') || err.message.includes('is_active')) {
          message = 'La base de datos está desactualizada (faltan columnas cruciales like "stock"). Ejecuta el script SQL de reparación en Supabase (disponibles en la sección Ayuda).';
        }
      }
      
      if (err.code === '42501') {
        message = 'Error de permisos: No tienes permiso para modificar la base de datos. Verifica las políticas RLS en Supabase.';
      } else if (err.code === 'PGRST116') {
        message = 'No se encontró el producto o no tienes permisos para verlo.';
      } else if (err.message?.includes('fetch')) {
        message = 'Error de conexión: No se pudo contactar con la base de datos. Verifica tu conexión a internet o la URL de Supabase.';
      }

      setError(message);
      if (message.includes('recursion')) {
        setError('Error de recursión en Supabase. Usa el SQL Editor para corregir las políticas de RLS (ver instrucciones al final de la página).');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category || 'Quesos Nacionales',
      price: product.price.toString(),
      stock: product.stock.toString(),
      is_active: product.is_active,
      image: product.image,
      secondaryImages: product.secondaryImages || []
    });
    
    // Check if category is custom
    const standardCategories = categories.map(c => c.name);
    if (product.category && !standardCategories.includes(product.category)) {
      setIsCustomCategory(true);
      setCustomCategory(product.category);
    } else {
      setIsCustomCategory(false);
      setCustomCategory('');
    }
    
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar "${name}"?`)) {
      await deleteProduct(id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-navy mb-2">Gestión de Productos</h1>
          <p className="text-darkgray/70">Administra el catálogo de tu tienda. Total: <span className="font-bold text-navy">{products.length} productos</span></p>
        </div>
        <button 
          onClick={() => {
            if (isAdding) {
              setIsAdding(false);
              setEditingProduct(null);
              setFormData({ name: '', description: '', category: 'Quesos Nacionales', price: '', stock: '0', is_active: true, image: '', secondaryImages: [] });
            } else {
              setIsAdding(true);
            }
          }}
          className="flex items-center space-x-2 bg-navy text-white px-4 py-2 rounded-md hover:bg-lightblue hover:text-navy transition-colors"
        >
          {isAdding ? <X size={18} /> : <PlusCircle size={18} />}
          <span>{isAdding ? 'Cancelar' : 'Nuevo Producto'}</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h3 className="text-lg font-medium text-navy">
              {editingProduct ? `Editando: ${editingProduct.name}` : 'Añadir Nuevo Producto'}
            </h3>
            {lastAddedProduct && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-100"
              >
                <span>¡Producto añadido!</span>
                <a 
                  href={`/producto/${lastAddedProduct.id}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 underline hover:text-green-800"
                >
                  <span>Ver página</span>
                  <ExternalLink size={14} />
                </a>
              </motion.div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Producto</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lightblue focus:border-transparent"
                  placeholder="Ej. Queso Brie"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                <div className="space-y-2">
                  <select 
                    value={isCustomCategory ? 'custom' : formData.category}
                    onChange={e => {
                      if (e.target.value === 'custom') {
                        setIsCustomCategory(true);
                      } else {
                        setIsCustomCategory(false);
                        setFormData({...formData, category: e.target.value});
                      }
                    }}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lightblue focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                    <option value="custom">+ Nueva Categoría...</option>
                  </select>
                  
                  {isCustomCategory && (
                    <motion.input 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      type="text"
                      required
                      value={customCategory}
                      onChange={e => setCustomCategory(e.target.value)}
                      placeholder="Nombre de la nueva categoría"
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lightblue focus:border-transparent"
                    />
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Precio ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lightblue focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                <input 
                  type="number" 
                  required
                  value={formData.stock}
                  onChange={e => setFormData({...formData, stock: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lightblue focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div className="md:col-span-2 flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                <input 
                  type="checkbox" 
                  id="is_active"
                  checked={formData.is_active}
                  onChange={e => setFormData({...formData, is_active: e.target.checked})}
                  className="w-5 h-5 text-lightblue rounded focus:ring-lightblue"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Producto Activo (Visible en la tienda)
                </label>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagen Principal</label>
                <div className="flex items-center space-x-6">
                  <div className="flex-1">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Haz clic para subir</span> o arrastra y suelta</p>
                        <p className="text-xs text-gray-500">PNG, JPG o WEBP (Max. 2MB)</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleMainImageChange} />
                    </label>
                  </div>
                  {formData.image && (
                    <div className="flex flex-col space-y-2">
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, image: '' }));
                            setImageWarnings(prev => ({ ...prev, main: undefined }));
                          }}
                          className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
                        >
                          <X size={14} className="text-gray-600" />
                        </button>
                      </div>
                      {imageWarnings.main && (
                        <p className="text-xs text-orange-500 font-medium max-w-[128px]">{imageWarnings.main}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Imágenes Secundarias</label>
                <div className="flex flex-col space-y-4">
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-6 h-6 mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">Subir imágenes adicionales</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" multiple onChange={handleSecondaryImagesChange} />
                  </label>
                  
                  {formData.secondaryImages.length > 0 && (
                    <div className="flex flex-wrap gap-4">
                      {formData.secondaryImages.map((url, idx) => (
                        <div key={idx} className="flex flex-col space-y-2">
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                            <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => removeSecondaryImage(idx)}
                              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
                            >
                              <X size={14} className="text-gray-600" />
                            </button>
                          </div>
                          {imageWarnings.secondary?.[idx] && (
                            <p className="text-[10px] text-orange-500 font-medium max-w-[96px] leading-tight">
                              {imageWarnings.secondary[idx]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea 
                  rows={3}
                  required
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lightblue focus:border-transparent resize-none"
                  placeholder="Describe el producto..."
                />
              </div>
            </div>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red/10 border border-red/20 text-red px-4 py-3 rounded-md text-sm font-medium mb-4 flex items-center space-x-2"
              >
                <div className="w-2 h-2 bg-red rounded-full animate-pulse"></div>
                <span>{error}</span>
              </motion.div>
            )}

            <div className="flex justify-end">
              <button 
                type="submit"
                disabled={isSaving}
                className={`bg-[#85A854] text-white px-8 py-3 rounded-md transition-all font-medium flex items-center space-x-2 ${isSaving ? 'opacity-70 cursor-not-allowed scale-95' : 'hover:bg-[#6b8743] hover:shadow-lg active:scale-95'}`}
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{editingProduct ? 'Actualizando...' : 'Guardando...'}</span>
                  </>
                ) : (
                  <span>{editingProduct ? 'Actualizar Producto' : 'Guardar Producto'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Product List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {products.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center justify-center space-y-6">
            <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center">
              <Package size={40} />
            </div>
            <div>
              <h3 className="text-xl font-serif text-navy mb-2">Inventario vacío</h3>
              <p className="text-darkgray/60 max-w-md mx-auto text-sm leading-relaxed">
                Si tenías productos anteriormente, es probable que se hayan borrado al ejecutar el script de configuración en el SQL Editor de Supabase (el cual recrea las tablas).
              </p>
              <p className="text-xs text-navy/40 mt-4 font-medium italic">
                * No te preocupes, puedes volver a agregarlos manualmente o usar el botón de recuperación de abajo.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => setIsAdding(true)}
                className="bg-navy text-white px-8 py-3 rounded-md hover:bg-lightblue hover:text-navy transition-all font-medium flex items-center space-x-2"
              >
                <Plus size={18} />
                <span>Agregar nuevo</span>
              </button>
              
              <button 
                onClick={async () => {
                  if (window.confirm('¿Deseas cargar productos de demostración para iniciar rápidamente?')) {
                    setIsSaving(true);
                    try {
                      // Primero asegurar que existan categorías
                      const demoCategories = [
                        { name: 'Quesos Nacionales', description: 'Quesos frescos y artesanales.', image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&q=80&w=800' },
                        { name: 'Embutidos Maduros', description: 'Carnes curadas y embutidos premium.', image: 'https://images.unsplash.com/photo-1626202114407-74431ae55609?auto=format&fit=crop&q=80&w=800' }
                      ];
                      
                      const productsToLoad = [
                        { name: 'Queso Oaxaca Premium 500g', price: 185, stock: 50, category: 'Quesos Nacionales', description: 'Queso tipo oaxaca de hebra fina y sabor láctico natural. Hecho con leche 100% pura.', image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&q=80&w=800' },
                        { name: 'Jamón Serrano Reserva 100g', price: 420, stock: 20, category: 'Embutidos Maduros', description: 'Jamón serrano con 12 meses de curación natural.', image: 'https://images.unsplash.com/photo-1626202114407-74431ae55609?auto=format&fit=crop&q=80&w=800' },
                        { name: 'Chorizo Argentino Parrillero', price: 145, stock: 35, category: 'Embutidos Maduros', description: 'Chorizo estilo argentino ideal para asados y parrilladas.', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800' }
                      ];

                      for (const p of productsToLoad) {
                        await addProduct({ ...p, is_active: true });
                      }
                      
                      alert('¡Listo! Se han cargado productos base.');
                    } catch (err) {
                      alert('Aviso: Algunos productos podrían ya existir o hubo un error al cargar: ' + (err as any).message);
                    } finally {
                      setIsSaving(false);
                    }
                  }
                }}
                disabled={isSaving}
                className="bg-white border border-gray-200 text-darkgray px-8 py-3 rounded-md hover:bg-gray-50 transition-all font-medium disabled:opacity-50"
              >
                Cargar productos base
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
                      <span className="font-medium text-navy">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category || 'Sin categoría'}</td>
                  <td className="px-6 py-4 text-sm font-medium text-[#85A854]">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 10 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {product.stock} unidades
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.is_active ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                      {product.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="text-lightblue hover:text-navy transition-colors"
                      >
                        Editar
                      </button>
                      <a 
                        href={`/producto/${product.id}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-navy transition-colors flex items-center space-x-1"
                        title="Ver en tienda"
                      >
                        <Eye size={16} />
                        <span>Ver</span>
                      </a>
                      <button 
                        onClick={() => handleDelete(product.id, product.name)}
                        className="text-red-400 hover:text-red-600 transition-colors flex items-center space-x-1"
                        title="Eliminar producto"
                      >
                        <Trash2 size={16} />
                        <span>Borrar</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </div>
  );
};

const AdminOrders = () => {
  const { orders, loading, fetchOrders, updateOrderStatus } = useOrders();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const selectedOrder = orders.find(o => o.id === selectedOrderId) || null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOrders();
    setIsRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente': return 'bg-orange-100 text-orange-700';
      case 'en proceso': return 'bg-blue-100 text-blue-700';
      case 'entregado': return 'bg-green-100 text-green-700';
      case 'cancelado': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleStatusUpdate = async (id: number, status: Order['status']) => {
    try {
      await updateOrderStatus(id, status);
    } catch (error) {
      alert('Error al actualizar el estado del pedido');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-serif text-navy mb-1 tracking-tight">Pedidos Recientes</h1>
          <p className="text-darkgray/60 text-sm">Monitorea y gestiona los pedidos entrantes.</p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={loading || isRefreshing}
          className="flex items-center space-x-2 bg-navy text-white px-5 py-2.5 rounded-xl hover:bg-gold hover:text-navy transition-all active:scale-95 disabled:opacity-50 shadow-md shadow-navy/10"
        >
          <Clock size={18} className={loading || isRefreshing ? 'animate-spin' : ''} />
          <span className="font-medium text-sm">Refrescar</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em]">ID / Fecha</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em]">Cliente</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em]">Total</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em]">Estado</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em]">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && !orders.length ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400 text-sm">Cargando pedidos...</p>
                      </div>
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <ShoppingBag size={48} className="text-gray-200 mb-4" />
                        <p className="text-gray-400 text-sm font-light">Aún no hay pedidos registrados.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr 
                      key={order.id} 
                      className={`hover:bg-lightblue/10 transition-colors cursor-pointer group ${selectedOrderId === order.id ? 'bg-lightblue/20' : ''}`}
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      <td className="px-6 py-5">
                        <div className="text-sm font-bold text-navy">#{order.id}</div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">{new Date(order.created_at).toLocaleDateString(undefined, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-semibold text-gray-800">{order.customer_name}</div>
                        <div className="text-xs text-gray-500 font-light truncate max-w-[150px] mt-0.5">{order.customer_address}</div>
                      </td>
                      <td className="px-6 py-5 text-sm font-black text-navy tracking-tight">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-5">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <button className="bg-gray-100 text-gray-500 group-hover:bg-navy group-hover:text-white p-2 rounded-lg transition-all">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Panel */}
        <div className="lg:col-span-1">
          {selectedOrder ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-gold/10 overflow-hidden sticky top-8"
            >
              <div className="bg-navy p-6 text-white relative">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold/80">Orden de Venta</span>
                  <button onClick={() => setSelectedOrderId(null)} className="text-white/50 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                </div>
                <h3 className="text-2xl font-serif">Detalle #{selectedOrder.id}</h3>
                <p className="text-xs text-white/60 mt-1">{new Date(selectedOrder.created_at).toLocaleString()}</p>
              </div>

              <div className="p-8 space-y-8">
                <section>
                  <h4 className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-4 border-b border-gray-100 pb-2">Cliente</h4>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-cream rounded-full flex items-center justify-center text-gold font-bold">
                      {selectedOrder.customer_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-navy font-bold">{selectedOrder.customer_name}</p>
                      <p className="text-xs text-gray-500 font-light mt-1 max-w-[200px] leading-relaxed italic">{selectedOrder.customer_address}</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-4 border-b border-gray-100 pb-2">Resumen de Productos</h4>
                  <div className="space-y-4 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-100">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <div className="flex items-center space-x-3">
                          <span className="w-6 h-6 rounded bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-400">{item.quantity}x</span>
                          <span className="text-navy font-medium">{item.product_name || 'Producto'}</span>
                        </div>
                        <span className="font-bold text-navy tracking-tight">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-100 flex justify-between items-end">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Total Pagado</span>
                    <span className="text-2xl font-black text-navy tracking-tighter">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </section>

                <section className="bg-cream/50 p-6 rounded-2xl border border-gold/10">
                  <h4 className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-4">Gestión de Estado</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {(['pendiente', 'en proceso', 'entregado', 'cancelado'] as const).map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                        className={`px-3 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] transition-all shadow-sm ${selectedOrder.status === status ? getStatusColor(status) + ' ring-2 ring-current ring-offset-2' : 'bg-white text-gray-400 hover:bg-white hover:text-navy border border-gray-100'}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </section>
                
                <div className="grid grid-cols-1 gap-3">
                  <a 
                    href={`https://wa.me/${selectedOrder.customer_address.includes('wa.me') ? '' : '524431373266'}?text=${encodeURIComponent(`Hola ${selectedOrder.customer_name}, te contacto sobre tu pedido #${selectedOrder.id} de Palbau...`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center space-x-2 bg-[#25D366] text-white py-3 rounded-xl hover:bg-[#128C7E] transition-colors text-xs font-bold uppercase tracking-wider"
                  >
                    <MessageCircle size={16} />
                    <span>Contactar Cliente</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-dashed border-gray-200 p-12 h-64 flex flex-col items-center justify-center text-center text-gray-400 sticky top-8">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <ClipboardList size={32} className="opacity-20" />
              </div>
              <p className="text-sm font-light">Selecciona un pedido para ver los detalles y actualizar su estado en tiempo real.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminUsers = () => {
  const { users, registerUser, updateUser } = useUsers();
  const [isAdding, setIsAdding] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    role: 'user',
    password: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const generateSecurePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    setFormData({ ...formData, password: retVal });
    setShowPassword(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingUser) {
        await updateUser(editingUser.id, { role: formData.role, full_name: formData.fullName });
        setEditingUser(null);
      } else {
        await registerUser(formData.email, formData.fullName, formData.role, formData.password);
      }
      setIsAdding(false);
      setFormData({ email: '', fullName: '', role: 'user', password: '' });
      setShowPassword(false);
    } catch (err) {
      alert(editingUser ? 'Error al actualizar usuario' : 'Error al registrar usuario');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (user: UserProfile) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      password: ''
    });
    setIsAdding(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-navy mb-2">Gestión de Usuarios</h1>
          <p className="text-darkgray/70">Administra los usuarios registrados en el sistema.</p>
        </div>
        <button 
          onClick={() => {
            if (isAdding) {
              setIsAdding(false);
              setEditingUser(null);
              setFormData({ email: '', fullName: '', role: 'user', password: '' });
              setShowPassword(false);
            } else {
              setIsAdding(true);
            }
          }}
          className="flex items-center space-x-2 bg-navy text-white px-4 py-2 rounded-md hover:bg-lightblue hover:text-navy transition-colors"
        >
          {isAdding ? <X size={18} /> : <UserPlus size={18} />}
          <span>{isAdding ? 'Cancelar' : 'Registrar Usuario'}</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
          <h3 className="text-lg font-medium text-navy mb-6">
            {editingUser ? `Editando Rol: ${editingUser.full_name}` : 'Nuevo Usuario'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <input 
                  type="text" 
                  required
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-lightblue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  required
                  disabled={!!editingUser}
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-lightblue disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-lightblue"
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              {!editingUser && (
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        required={!editingUser}
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-lightblue"
                        placeholder="Mínimo 6 caracteres"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy"
                      >
                        {showPassword ? <X size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <button 
                      type="button"
                      onClick={generateSecurePassword}
                      className="flex items-center space-x-1 bg-gray-100 text-navy px-3 py-2 rounded-md hover:bg-gold hover:text-white transition-all text-xs font-bold"
                    >
                      <Shield size={14} />
                      <span>Generar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end pt-4">
              <button 
                type="submit"
                disabled={isSaving}
                className="bg-navy text-white px-6 py-2 rounded-md hover:bg-lightblue hover:text-navy transition-all disabled:opacity-50"
              >
                {isSaving ? 'Guardando...' : (editingUser ? 'Actualizar' : 'Registrar')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha Registro</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-navy font-bold text-xs">
                        {user.full_name.charAt(0)}
                      </div>
                      <span className="font-medium text-navy">{user.full_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-gold/10 text-gold' : 'bg-gray-100 text-gray-600'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleEdit(user)}
                      className="text-lightblue hover:text-navy transition-colors text-sm font-medium"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminCategories = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [imageWarning, setImageWarning] = useState<string | undefined>(undefined);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  });

  const processImage = (file: File, targetSize: number = 1200): Promise<{url: string, warning?: string}> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let warning = undefined;
          if (img.width < 400 || img.height < 400) {
            warning = 'La imagen es un poco pequeña, podría verse borrosa.';
          } else if (img.width > 4000 || img.height > 4000) {
            warning = 'La imagen es muy grande, la hemos optimizado para la web.';
          }

          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > targetSize) {
              height *= targetSize / width;
              width = targetSize;
            }
          } else {
            if (height > targetSize) {
              width *= targetSize / height;
              height = targetSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          resolve({
            url: canvas.toDataURL('image/jpeg', 0.8),
            warning
          });
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const { url, warning } = await processImage(file);
      setFormData(prev => ({ ...prev, image: url }));
      setImageWarning(warning);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.image) {
      alert('Por favor, completa el nombre y selecciona una imagen.');
      return;
    }

    try {
      setIsSaving(true);
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
      } else {
        await addCategory(formData);
      }
      setIsFormOpen(false);
      setFormData({ name: '', description: '', image: '' });
      setEditingCategory(null);
      setImageWarning(undefined);
    } catch (error: any) {
      console.error('Error saving category:', error);
      let message = 'Error al guardar la categoría.';
      if (error.message) {
        message += ` Detalle: ${error.message}`;
        if (error.message.includes('recursion')) {
          message = 'Error crítico de recursión en Supabase. Ve a la sección "Ayuda" al final de esta página para corregirlo con un comando SQL.';
        }
        if (error.message.includes('column') || error.message.includes('stock') || error.message.includes('is_active')) {
          message = 'La base de datos está desactualizada (faltan columnas). Ejecuta el script SQL en Supabase para añadir los campos necesarios.';
        }
      }
      if (error.code === '42501') message = 'Error de permisos (RLS): No tienes permiso para escribir en la tabla de categorías. Asegúrate de haber ejecutado el script SQL como administrador.';
      alert(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description,
      image: cat.image
    });
    setImageWarning(undefined);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      try {
        await deleteCategory(id);
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error al eliminar la categoría.');
      }
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif text-navy">Gestión de Categorías</h2>
          <p className="text-darkgray/60 mt-1 text-sm md:text-base">Administra las categorías destacadas que se muestran en el inicio.</p>
        </div>
        <button 
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: '', description: '', image: '' });
            setImageWarning(undefined);
            setIsFormOpen(true);
          }}
          className="flex items-center justify-center space-x-2 bg-gold hover:bg-gold/90 text-navy font-bold px-6 py-3 rounded-md transition-all shadow-md shadow-gold/20 w-full sm:w-auto"
        >
          <PlusCircle size={20} />
          <span>Nueva Categoría</span>
        </button>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-serif text-navy">{editingCategory ? 'Editar Categoría' : 'Añadir Nueva Categoría'}</h3>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-red transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-navy mb-2">Nombre de la Categoría</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ej. Quesos Gourmet"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy mb-2">Descripción</label>
                    <textarea 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={4}
                      placeholder="Breve descripción de la categoría..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-gold transition-colors resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy mb-2">Imagen de la Categoría</label>
                  <div className="flex flex-col space-y-4">
                    <div className="relative group">
                      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden">
                        {formData.image ? (
                          <div className="relative w-full h-full">
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <UploadCloud className="w-8 h-8 text-white" />
                              <span className="ml-2 text-white font-medium">Cambiar imagen</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Haz clic para subir</span></p>
                            <p className="text-xs text-gray-400 text-center px-4">PNG, JPG o WEBP (Optimizada automáticamente)</p>
                          </div>
                        )}
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                      {formData.image && (
                        <button 
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, image: '' }));
                            setImageWarning(undefined);
                          }}
                          className="absolute -top-2 -right-2 bg-red text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    {imageWarning && (
                      <p className="text-xs text-orange-500 font-medium flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {imageWarning}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-3 text-darkgray hover:text-red transition-colors font-medium order-2 sm:order-1"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center justify-center space-x-2 bg-navy text-white px-8 py-3 rounded-md hover:bg-lightblue hover:text-navy transition-colors disabled:opacity-50 order-1 sm:order-2 w-full sm:w-auto"
                >
                  {isSaving ? <Clock className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                  <span>{isSaving ? 'Guardando...' : (editingCategory ? 'Actualizar Categoría' : 'Guardar Categoría')}</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.length === 0 ? (
          <div className="col-span-full py-20 bg-white rounded-xl border border-dashed border-gray-200 text-center flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center">
              <Tags size={32} />
            </div>
            <div>
              <h3 className="text-xl font-serif text-navy mb-2">No hay categorías</h3>
              <p className="text-darkgray/60 max-w-sm mx-auto text-sm">
                Las categorías son necesarias para organizar tus productos y mostrarlos en el inicio.
              </p>
            </div>
            <button 
              onClick={async () => {
                if (window.confirm('¿Deseas cargar las categorías principales (Quesos, Jamones, etc.)?')) {
                  const demoCats = [
                    { name: 'Quesos Nacionales', description: 'Oaxaca, Rancho, Panela y más frescos naturales.', image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&q=80&w=800' },
                    { name: 'Embutidos Maduros', description: 'Jamones serranos, chorizos y carnes frías de alta calidad.', image: 'https://images.unsplash.com/photo-1626202114407-74431ae55609?auto=format&fit=crop&q=80&w=800' },
                    { name: 'Quesos Importados', description: 'Manchego, Gouda, Brie y selecciones internacionales.', image: 'https://images.unsplash.com/photo-1485962391945-448ef0fd3525?auto=format&fit=crop&q=80&w=800' }
                  ];
                  for (const c of demoCats) {
                    await addCategory(c);
                  }
                  alert('Categorías iniciales creadas.');
                }
              }}
              className="px-6 py-2 border border-navy text-navy rounded-md hover:bg-navy hover:text-white transition-colors text-sm font-medium"
            >
              Cargar categorías base
            </button>
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-md transition-shadow">
            <div className="h-48 relative overflow-hidden">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute top-4 right-4 flex space-x-2">
                <button 
                  onClick={() => handleEdit(cat)}
                  className="p-2 bg-white/90 backdrop-blur-sm text-navy rounded-full shadow-sm hover:bg-gold hover:text-white transition-all"
                  title="Editar"
                >
                  <PlusCircle size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 bg-white/90 backdrop-blur-sm text-red rounded-full shadow-sm hover:bg-red hover:text-white transition-all"
                  title="Eliminar"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <h4 className="text-xl font-serif text-navy mb-2">{cat.name}</h4>
              <p className="text-darkgray/70 text-sm font-light line-clamp-2">{cat.description}</p>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
};

const AdminHelp = () => {
  const { currentUser } = useUsers();
  
  const repairSql = `-- 1. Reparar Tablas y Columnas Faltantes
ALTER TABLE IF EXISTS public.products 
ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS secondary_images TEXT[] DEFAULT '{}';

-- 2. REPARACIÓN TOTAL DE PEDIDOS
-- Esto borrará pedidos previos para asegurar compatibilidad total de tipos (bigint)
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;

-- Crear tabla de pedidos
CREATE TABLE public.orders (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    total DECIMAL(12,2) NOT NULL,
    status TEXT DEFAULT 'pendiente',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear tabla de items con claves foráneas explícitas
CREATE TABLE public.order_items (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    order_id BIGINT REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES public.products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(12,2) NOT NULL
);

-- 3. Asegurar Perfil de Administrador
INSERT INTO public.profiles (id, email, role, full_name) 
VALUES ('${currentUser?.id}', '${currentUser?.email}', 'admin', 'Administrador') 
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- 4. Habilitar Acceso Total (Sin RLS para simplicidad en este proyecto)
-- Esto es CRUCIAL para que los clientes puedan registrar sus compras
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;

-- 5. Dar permisos explícitos a todos los roles (anon y authenticated)
GRANT ALL ON public.orders TO anon, authenticated;
GRANT ALL ON public.order_items TO anon, authenticated;
GRANT ALL ON public.products TO anon, authenticated;
GRANT ALL ON public.categories TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;

-- Corregir secuencias para permitir autoincrementables públicos
GRANT USAGE, SELECT ON SEQUENCE orders_id_seq TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE order_items_id_seq TO anon, authenticated;

-- 6. Forzar refresco de caché de Supabase (opcional pero recomendado)
NOTIFY pgrst, 'reload schema';`;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-red-100">
        <div className="bg-red p-6 text-white flex items-center space-x-4">
          <LifeBuoy size={32} />
          <div>
            <h2 className="text-2xl font-serif">Soporte Técnico y Reparación</h2>
            <p className="text-white/80 text-sm">Usa esta sección si experimentas errores al guardar productos o categorías.</p>
          </div>
        </div>
        
        <div className="p-8 space-y-6">
          <section>
            <h3 className="text-lg font-bold text-navy mb-2 flex items-center">
              <AlertCircle size={18} className="mr-2 text-red" />
              ¿Por qué veo errores?
            </h3>
            <p className="text-darkgray text-sm leading-relaxed">
              Si ves errores como <span className="font-mono bg-gray-100 px-1 text-red">"column stock not found"</span> o <span className="font-mono bg-gray-100 px-1 text-red">"infinite recursion"</span>, es porque la base de datos de Supabase no tiene la estructura que la aplicación necesita o hay un conflicto de permisos RLS.
            </p>
          </section>

          <section className="bg-cream p-6 rounded-xl border border-gold/20">
            <h3 className="text-navy font-bold mb-4 uppercase tracking-wider text-xs">Instrucciones de Reparación:</h3>
            <ol className="space-y-4 text-sm text-darkgray">
              <li className="flex items-start">
                <span className="bg-navy text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 text-xs">1</span>
                <div>
                  <strong>Copia el código SQL</strong> que aparece a continuación.
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-navy text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 text-xs">2</span>
                <div>
                  Ve a tu panel de control de <strong>Supabase</strong>.
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-navy text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 text-xs">3</span>
                <div>
                  Busca la sección <strong>SQL Editor</strong> en el menú lateral izquierdo.
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-navy text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 text-xs">4</span>
                <div>
                  Haz clic en <strong>"+ New Query"</strong>, pega el código y presiona el botón verde <strong>"Run"</strong>.
                </div>
              </li>
            </ol>
          </section>

          <section>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-navy uppercase tracking-widest">Código SQL de Reparación</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(repairSql);
                  alert('¡Código copiado al portapapeles!');
                }}
                className="text-xs text-gold hover:text-navy font-bold flex items-center transition-colors"
                id="copy-sql-button-help"
              >
                <ClipboardList size={14} className="mr-1" />
                Copiar Código
              </button>
            </div>
            <div className="bg-navy text-lightblue p-6 rounded-xl font-mono text-[11px] overflow-x-auto whitespace-pre border border-navy shadow-inner max-h-[400px] scrollbar-thin scrollbar-thumb-white/20">
              {repairSql}
            </div>
          </section>

          <footer className="pt-6 border-t border-gray-100">
            <p className="text-xs text-center text-gray-400">
              Una vez ejecutado, intenta recargar esta página y guardar tus cambios de nuevo. Si el problema persiste, contacta con soporte técnico.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

const AdminLogin = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { registerUser, users } = useUsers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isRegister) {
        // Registro
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: 'user' // Por defecto se registra como user, luego se cambia en DB
            }
          }
        });
        if (signUpError) throw signUpError;
        alert('Cuenta creada con éxito. DEBES confirmar tu correo electrónico (revisa spam) antes de intentar entrar.');
        setIsRegister(false);
      } else {
        // Login
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (loginError) {
          if (loginError.message === 'Email not confirmed') {
            throw new Error('Debes confirmar tu correo electrónico. Revisa tu bandeja de entrada o spam.');
          }
          throw loginError;
        }
        
        // Verificación adicional de perfil tras logueo exitoso en Auth
        if (data.user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();
          
          if (profileError && profileError.code === 'PGRST116') {
            // No hay perfil, intentamos crearlo (esto pasa si el trigger falló)
            await supabase.from('profiles').upsert({
              id: data.user.id,
              email: data.user.email,
              full_name: data.user.user_metadata?.full_name || '',
              role: 'admin' // Si es el primer usuario que entra tras crearlo, lo ponemos como admin
            });
          } else if (profileData && profileData.role !== 'admin') {
            setError('Tu cuenta no tiene permisos de administrador. Necesitas cambiar el rol a "admin" en la tabla profiles.');
            // No cerramos sesión aquí para que AdminRoutes pueda mostrar la info de ayuda
          }
        }
      }
    } catch (err: any) {
      setError(err.message === 'Invalid login credentials' ? 'Correo o contraseña incorrectos' : err.message);
    } finally {
      setLoading(false);
    }
  };

  const seedAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const admins = [
        { email: 'haroldo90@palbau.com', name: 'Haroldo Palbau', pass: 'chevropar#1970' },
        { email: 'jesus_palbau@palbau.com', name: 'Jesus Palbau', pass: 'chevropar#1970' }
      ];

      for (const admin of admins) {
        try {
          // Intentar registro en Auth
          const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email: admin.email,
            password: admin.pass,
            options: {
              data: {
                full_name: admin.name,
                role: 'admin'
              }
            }
          });

          // Forzar inserción en perfiles por si el trigger falló anteriormente
          const userId = authData.user?.id;
          if (userId) {
            await supabase.from('profiles').upsert({
              id: userId,
              email: admin.email,
              full_name: admin.name,
              role: 'admin'
            });
          }
        } catch (e) {
          console.warn(`Error configurando ${admin.email}:`, e);
        }
      }
      alert('¡Proceso iniciado! Supabase ha enviado un correo de confirmación a estas direcciones. DEBES confirmar el email (revisa spam) antes de poder entrar al panel.');
    } catch (err: any) {
      setError('Error crítico: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6 bg-[url('https://appdesignproyectos.com/textura_papel.png')] bg-repeat">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-8 md:p-12 rounded-2xl shadow-2xl border border-gold/10 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-navy/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="text-center mb-10 relative z-10">
          <img 
            src="https://appdesignproyectos.com/palbau.png" 
            alt="PALBAU" 
            className="h-16 mx-auto mb-6 object-contain"
          />
          <h2 className="text-3xl font-serif text-navy mb-2">Panel de Control</h2>
          <p className="text-darkgray/60 font-light">
            {isRegister ? 'Crea una cuenta para registrarte' : 'Inicia sesión para administrar tu tienda'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {isRegister && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2"
            >
              <label className="text-xs uppercase tracking-widest text-gray-400 font-bold flex items-center">
                <Users size={12} className="mr-2" />
                Nombre Completo
              </label>
              <input 
                type="text" 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all font-light"
              />
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-gray-400 font-bold flex items-center">
              <Mail size={12} className="mr-2" />
              Correo Electrónico
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all font-light"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-gray-400 font-bold flex items-center">
              <Key size={12} className="mr-2" />
              Contraseña
            </label>
            <div className="relative">
              <input 
                id="password-field"
                name="password"
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all font-light pr-12 text-navy"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold transition-colors z-20 p-1"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-red/10 border border-red/20 rounded-lg flex items-center space-x-3 text-red text-sm"
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </motion.div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-navy text-white py-4 rounded-lg font-bold uppercase tracking-[0.2em] text-xs hover:bg-gold transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            {loading ? (isRegister ? 'Registrando...' : 'Iniciando sesión...') : (isRegister ? 'Crear Cuenta' : 'Entrar al Panel')}
          </button>
        </form>

        <div className="mt-6 text-center relative z-10">
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-gold hover:text-navy font-bold uppercase tracking-widest transition-colors"
          >
            {isRegister ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>

        {(!users || users.length === 0) && !isRegister && (
          <div className="mt-10 pt-8 border-t border-gray-100 text-center relative z-10">
            <p className="text-xs text-gray-400 mb-4 font-light italic">¿Es la primera vez que entras?</p>
            <button 
              onClick={seedAdmins}
              disabled={loading}
              className="flex items-center justify-center space-x-2 mx-auto text-gold hover:text-navy transition-colors text-xs font-bold uppercase tracking-widest"
            >
              <Shield size={14} />
              <span>Configurar Administradores</span>
            </button>
          </div>
        )}

        <div className="mt-8 text-center text-[10px] text-gray-300 uppercase tracking-widest font-light">
          PALBAU &copy; {new Date().getFullYear()}
        </div>
      </motion.div>
    </div>
  );
};

export const AdminRoutes = () => {
  const { isAdmin, loading, currentUser, profile, fetchProfile } = useUsers();
  const [refreshing, setRefreshing] = useState(false);

  // Lista blanca forzada para evitar cualquier bloqueo accidental
  const isAllowlisted = currentUser && [
    'haroldo90@palbau.com',
    'haroldo90@hotmail.com',
    'haroldo90@gmail.com',
    'haroldove90@gmail.com',
    'jesus_palbau@palbau.com'
  ].includes(currentUser.email?.toLowerCase() || '');

  const handleRefresh = async () => {
    if (currentUser) {
      setRefreshing(true);
      await fetchProfile(currentUser.id);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-gold border-t-navy rounded-full animate-spin"></div>
          <p className="text-navy font-serif tracking-widest uppercase text-xs">Cargando Panel...</p>
        </div>
      </div>
    );
  }

  // Caso: Autenticado pero NO es admin (y no está en la lista blanca)
  if (currentUser && !isAdmin && !isAllowlisted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6 bg-[url('https://appdesignproyectos.com/textura_papel.png')] bg-repeat">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl w-full bg-white p-8 md:p-12 rounded-2xl shadow-2xl border border-red/20 relative"
        >
          <div className="text-center mb-8">
            <Shield size={48} className="mx-auto text-red mb-4" />
            <h2 className="text-2xl font-serif text-navy mb-2">Configuración Requerida</h2>
            <p className="text-darkgray/70">
              Has iniciado sesión como <span className="font-bold">{currentUser.email}</span>. Para poder gestionar la tienda, necesitamos activar tus permisos en la base de datos.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border-2 border-gold/30 mb-8 overflow-hidden">
            <p className="text-xs font-bold text-navy uppercase tracking-widest mb-4 flex items-center">
              <Shield size={14} className="mr-2 text-gold" />
              Paso Final: Activar permisos de escritura
            </p>
            <p className="text-sm text-darkgray mb-4">
              Copia y ejecuta este código en el <strong>SQL Editor</strong> de Supabase para corregir errores de permisos y recursión:
            </p>
            <div className="bg-navy text-lightblue p-4 rounded-lg font-mono text-[9px] overflow-x-auto whitespace-pre mb-4 border border-gold/20 shadow-inner">
              {`-- 1. Reparar Tablas y Columnas Faltantes\nALTER TABLE IF EXISTS public.products \nADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0,\nADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,\nADD COLUMN IF NOT EXISTS secondary_images TEXT[] DEFAULT '{}';\n\n-- 2. REPARACIÓN TOTAL DE PEDIDOS\nDROP TABLE IF EXISTS public.order_items CASCADE;\nDROP TABLE IF EXISTS public.orders CASCADE;\n\nCREATE TABLE public.orders (\n    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,\n    customer_name TEXT NOT NULL,\n    customer_address TEXT NOT NULL,\n    total DECIMAL(12,2) NOT NULL,\n    status TEXT DEFAULT 'pendiente',\n    created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\nCREATE TABLE public.order_items (\n    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,\n    order_id BIGINT REFERENCES public.orders(id) ON DELETE CASCADE,\n    product_id BIGINT REFERENCES public.products(id),\n    quantity INTEGER NOT NULL,\n    price DECIMAL(12,2) NOT NULL\n);\n\n-- 3. Asegurar Perfil de Administrador\nINSERT INTO public.profiles (id, email, role, full_name) \nVALUES ('${currentUser.id}', '${currentUser.email}', 'admin', 'Administrador') \nON CONFLICT (id) DO UPDATE SET role = 'admin';\n\n-- 4. Habilitar Acceso Total\nALTER TABLE public.products DISABLE ROW LEVEL SECURITY;\nALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;\nALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;\nALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;\nALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;\n\n-- 5. Dar permisos explícitos\nGRANT ALL ON public.orders TO anon, authenticated;\nGRANT ALL ON public.order_items TO anon, authenticated;\nGRANT ALL ON public.products TO anon, authenticated;\nGRANT ALL ON public.categories TO anon, authenticated;\nGRANT ALL ON public.profiles TO anon, authenticated;\n\nGRANT USAGE, SELECT ON SEQUENCE orders_id_seq TO anon, authenticated;\nGRANT USAGE, SELECT ON SEQUENCE order_items_id_seq TO anon, authenticated;\n\nNOTIFY pgrst, 'reload schema';`}
            </div>
            <p className="text-[11px] font-bold text-navy mb-2 uppercase">Instrucciones:</p>
            <p className="text-[10px] text-gray-500 mb-4">
              Ve a <strong>Supabase &gt; SQL Editor &gt; New Query</strong>, pega el código y presiona <strong>Run</strong>. Esto corregirá los errores de "column not found" y "recursion" automáticamente.
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="w-full bg-navy text-white py-4 rounded-lg font-bold uppercase tracking-[0.2em] text-xs hover:bg-gold transition-all flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg shadow-navy/20"
            >
              {refreshing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verificando...</span>
                </>
              ) : (
                <span>Ya ejecuté el código, entrar</span>
              )}
            </button>
            <button 
              onClick={() => supabase.auth.signOut()}
              className="w-full border border-gray-200 text-gray-400 py-3 rounded-lg font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"
            >
              <LogOut size={14} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AdminLogin />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/ventas" replace />} />
        <Route path="/ventas" element={<AdminSales />} />
        <Route path="/pedidos" element={<AdminOrders />} />
        <Route path="/productos" element={<AdminProducts />} />
        <Route path="/categorias" element={<AdminCategories />} />
        <Route path="/usuarios" element={<AdminUsers />} />
        <Route path="/ayuda" element={<AdminHelp />} />
      </Routes>
    </AdminLayout>
  );
};
