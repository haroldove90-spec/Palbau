import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product_name?: string;
};

export type Order = {
  id: number;
  customer_name: string;
  customer_address: string;
  total: number;
  status: 'pendiente' | 'en proceso' | 'completado' | 'cancelado';
  created_at: string;
  items?: OrderItem[];
};

type OrderContextType = {
  orders: Order[];
  updateOrderStatus: (id: number, status: Order['status']) => Promise<void>;
  fetchOrders: () => Promise<void>;
  createOrder: (order: Omit<Order, 'id' | 'created_at' | 'status'>, items: Omit<OrderItem, 'id' | 'order_id'>[]) => Promise<void>;
};

const OrderContext = createContext<OrderContextType | null>(null);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within an OrderProvider');
  return context;
};

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedOrders: Order[] = (data || []).map(o => ({
        id: o.id,
        customer_name: o.customer_name,
        customer_address: o.customer_address,
        total: Number(o.total),
        status: o.status,
        created_at: o.created_at,
        items: o.order_items.map((item: any) => ({
          id: item.id,
          order_id: item.order_id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: Number(item.price),
          product_name: item.products?.name
        }))
      }));

      setOrders(mappedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: number, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  const createOrder = async (order: Omit<Order, 'id' | 'created_at' | 'status'>, items: Omit<OrderItem, 'id' | 'order_id'>[]) => {
    try {
      // 1. Create the order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_name: order.customer_name,
          customer_address: order.customer_address,
          total: order.total,
          status: 'pendiente'
        }])
        .select();

      if (orderError) throw orderError;
      const newOrderId = orderData[0].id;

      // 2. Create the order items
      const itemsToInsert = items.map(item => ({
        order_id: newOrderId,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      // 3. Refresh orders
      await fetchOrders();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  return (
    <OrderContext.Provider value={{ orders, updateOrderStatus, fetchOrders, createOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
