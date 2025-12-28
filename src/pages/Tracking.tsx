import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, Truck, CheckCircle, Clock, X, MapPin, Calendar, User, Mail, Phone, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loading } from '@/components/ui/loading';

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
}

interface OrderDetails {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  country: string;
  status: string;
  total: number;
  items_count: number;
  tracking_number: string;
  created_at: string;
  items: OrderItem[];
}

const statusSteps = ['processing', 'shipped', 'out-for-delivery', 'delivered'];

export default function Tracking() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError('');
    setOrder(null);

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .or(`order_number.ilike.%${searchQuery}%,tracking_number.ilike.%${searchQuery}%`)
      .maybeSingle();

    if (orderError) {
      setError(t('errorFetchingOrder'));
      setLoading(false);
      return;
    }

    if (!orderData) {
      setError(t('orderNotFound'));
      setLoading(false);
      return;
    }

    // Fetch order items
    const { data: itemsData } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderData.id);

    setOrder({
      ...orderData,
      items: itemsData || []
    });
    setLoading(false);
  };

  const getStatusIcon = (status: string, isActive: boolean) => {
    const iconClass = `h-6 w-6 ${isActive ? 'text-primary' : 'text-muted-foreground'}`;
    switch (status) {
      case 'processing':
        return <Clock className={iconClass} />;
      case 'shipped':
        return <Package className={iconClass} />;
      case 'out-for-delivery':
        return <Truck className={iconClass} />;
      case 'delivered':
        return <CheckCircle className={iconClass} />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'processing':
        return t('processing');
      case 'shipped':
        return t('shipped');
      case 'out-for-delivery':
        return t('outForDelivery');
      case 'delivered':
        return t('delivered');
      case 'cancelled':
        return t('cancelled');
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'out-for-delivery':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getCurrentStepIndex = (status: string) => {
    if (status === 'cancelled') return -1;
    return statusSteps.indexOf(status);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('trackOrder')}</h1>
          <p className="text-muted-foreground">{t('trackOrderSubtitle')}</p>
        </div>

        {/* Search Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('enterOrderOrTracking')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? t('searching') : t('trackOrder')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loading */}
        {loading && <Loading />}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-destructive/50 bg-destructive/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  <p>{error}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Order Details */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Order Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{t('orderNumber')}: {order.order_number}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {order.tracking_number && `${t('trackingNumber')}: ${order.tracking_number}`}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Status Timeline */}
            {order.status !== 'cancelled' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('orderProgress')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    {statusSteps.map((step, index) => {
                      const currentIndex = getCurrentStepIndex(order.status);
                      const isCompleted = index <= currentIndex;
                      const isActive = index === currentIndex;
                      
                      return (
                        <div key={step} className="flex flex-col items-center flex-1">
                          <div className="relative flex items-center w-full">
                            {index > 0 && (
                              <div 
                                className={`absolute left-0 right-1/2 h-1 -translate-y-1/2 top-1/2 ${
                                  index <= currentIndex ? 'bg-primary' : 'bg-muted'
                                }`} 
                              />
                            )}
                            {index < statusSteps.length - 1 && (
                              <div 
                                className={`absolute left-1/2 right-0 h-1 -translate-y-1/2 top-1/2 ${
                                  index < currentIndex ? 'bg-primary' : 'bg-muted'
                                }`} 
                              />
                            )}
                            <div 
                              className={`relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                                isCompleted 
                                  ? 'border-primary bg-primary/10' 
                                  : 'border-muted bg-background'
                              } ${isActive ? 'ring-4 ring-primary/20' : ''}`}
                            >
                              {getStatusIcon(step, isCompleted)}
                            </div>
                          </div>
                          <p className={`mt-2 text-sm font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {getStatusLabel(step)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cancelled Order Notice */}
            {order.status === 'cancelled' && (
              <Card className="border-destructive/50 bg-destructive/10">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 text-destructive">
                    <X className="h-6 w-6" />
                    <div>
                      <p className="font-semibold">{t('orderCancelled')}</p>
                      <p className="text-sm">{t('orderCancelledDesc')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('customerInformation')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{order.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{order.customer_email}</span>
                  </div>
                  {order.customer_phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{order.customer_phone}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('shippingAddress')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {order.shipping_address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>
                        {order.shipping_address}
                        {order.city && `, ${order.city}`}
                        {order.country && `, ${order.country}`}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{t('orderedOn')}: {new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('orderItems')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-muted-foreground">{t('quantity')}: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">${Number(item.price).toFixed(2)}</p>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <p className="font-semibold text-lg">{t('total')}</p>
                    <p className="font-bold text-xl text-primary">${Number(order.total).toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && !order && (
          <Card className="border-dashed">
            <CardContent className="pt-12 pb-12">
              <div className="text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('trackYourOrder')}</h3>
                <p className="text-muted-foreground">{t('enterOrderNumberToTrack')}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
