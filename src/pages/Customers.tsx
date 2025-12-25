import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, Loader2, Mail, Phone, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Customer {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  city: string;
  country: string;
  order_count: number;
  total_spent: number;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const { data } = await supabase
      .from('orders')
      .select('customer_name, customer_email, customer_phone, city, country, total');

    if (data) {
      const customerMap = new Map<string, Customer>();
      
      data.forEach((order) => {
        const existing = customerMap.get(order.customer_email);
        if (existing) {
          existing.order_count += 1;
          existing.total_spent += Number(order.total);
        } else {
          customerMap.set(order.customer_email, {
            customer_name: order.customer_name,
            customer_email: order.customer_email,
            customer_phone: order.customer_phone || '',
            city: order.city || '',
            country: order.country || '',
            order_count: 1,
            total_spent: Number(order.total)
          });
        }
      });

      setCustomers(Array.from(customerMap.values()));
    }
    setLoading(false);
  };

  const filteredCustomers = customers.filter(c =>
    c.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.customer_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground">View customer information from orders</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No customers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredCustomers.map((customer, index) => (
                <motion.div
                  key={customer.customer_email}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-semibold text-primary">
                          {customer.customer_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{customer.customer_name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {customer.order_count} order{customer.order_count !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{customer.customer_email}</span>
                    </div>
                    {customer.customer_phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{customer.customer_phone}</span>
                      </div>
                    )}
                    {(customer.city || customer.country) && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{[customer.city, customer.country].filter(Boolean).join(', ')}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Spent</span>
                      <span className="font-bold text-primary">${customer.total_spent.toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
