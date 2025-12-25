import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, DollarSign, Users, TrendingUp, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import StatsCard from '@/components/admin/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentOrders();
  }, []);

  const fetchStats = async () => {
    const [productsRes, ordersRes] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact' }),
      supabase.from('orders').select('id, total', { count: 'exact' })
    ]);

    const totalRevenue = ordersRes.data?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

    setStats({
      totalProducts: productsRes.count || 0,
      totalOrders: ordersRes.count || 0,
      totalRevenue,
      totalCustomers: ordersRes.count || 0
    });
    setLoading(false);
  };

  const fetchRecentOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    setRecentOrders(data || []);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'shipped': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'processing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your admin dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Products"
            value={stats.totalProducts}
            icon={<Package className="h-6 w-6" />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<ShoppingCart className="h-6 w-6" />}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon={<DollarSign className="h-6 w-6" />}
            trend={{ value: 15, isPositive: true }}
          />
          <StatsCard
            title="Customers"
            value={stats.totalCustomers}
            icon={<Users className="h-6 w-6" />}
            trend={{ value: 5, isPositive: true }}
          />
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between p-4 bg-accent/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-foreground">{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">${Number(order.total).toFixed(2)}</p>
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
