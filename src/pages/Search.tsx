import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search as SearchIcon } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function Search() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data: products } = useQuery({
    queryKey: ['search-products', query],
    queryFn: async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(10);
      return data || [];
    },
    enabled: !!query,
  });

  const { data: categories } = useQuery({
    queryKey: ['search-categories', query],
    queryFn: async () => {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(10);
      return data || [];
    },
    enabled: !!query,
  });

  const { data: orders } = useQuery({
    queryKey: ['search-orders', query],
    queryFn: async () => {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .or(`customer_name.ilike.%${query}%,order_number.ilike.%${query}%`)
        .limit(10);
      return data || [];
    },
    enabled: !!query,
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <SearchIcon className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('searchResults')}</h1>
            <p className="text-muted-foreground">"{query}"</p>
          </div>
        </div>

        {/* Products Results */}
        {products && products.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">{t('products')} ({products.length})</h2>
            <div className="bg-card rounded-lg border border-border card-gradient-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Categories Results */}
        {categories && categories.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">{t('categories')} ({categories.length})</h2>
            <div className="bg-card rounded-lg border border-border card-gradient-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="text-muted-foreground">{category.description || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Orders Results */}
        {orders && orders.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">{t('orders')} ({orders.length})</h2>
            <div className="bg-card rounded-lg border border-border card-gradient-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.order_number}</TableCell>
                      <TableCell>{order.customer_name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{order.status}</Badge>
                      </TableCell>
                      <TableCell>${order.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* No Results */}
        {query && (!products?.length && !categories?.length && !orders?.length) && (
          <div className="text-center py-12 text-muted-foreground">
            No results found for "{query}"
          </div>
        )}
      </div>
    </AdminLayout>
  );
}