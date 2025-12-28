import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Truck, MapPin, Calendar, ArrowRight, Copy, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loading } from '@/components/ui/loading';
import { useToast } from '@/hooks/use-toast';

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

export default function OrderConfirmation() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [copied, setCopied] = useState(false);

  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrder = async () => {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .maybeSingle();

    if (orderError || !orderData) {
      setLoading(false);
      return;
    }

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

  const copyOrderNumber = () => {
    if (order) {
      navigator.clipboard.writeText(order.order_number);
      setCopied(true);
      toast({ title: t('copied'), description: t('orderNumberCopied') });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loading />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t('orderNotFound')}</h2>
            <p className="text-muted-foreground mb-4">{t('orderNotFoundDesc')}</p>
            <Button onClick={() => navigate('/')}>
              {t('returnHome')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Success Header */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{t('orderConfirmed')}</h1>
          <p className="text-muted-foreground">{t('thankYouForOrder')}</p>
        </motion.div>

        {/* Order Number Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('orderNumber')}</p>
                  <p className="text-2xl font-mono font-bold text-primary">{order.order_number}</p>
                </div>
                <Button variant="outline" size="icon" onClick={copyOrderNumber}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                {t('confirmationEmailSent')} {order.customer_email}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5" />
                {t('orderStatus')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                    <Package className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{t('processing')}</p>
                  <p className="text-sm text-muted-foreground">{t('orderBeingPrepared')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Delivery Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="h-5 w-5" />
                {t('deliveryInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{t('shippingAddress')}</p>
                  <p className="text-muted-foreground">
                    {order.customer_name}<br />
                    {order.shipping_address && `${order.shipping_address}, `}
                    {order.city && `${order.city}, `}
                    {order.country}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{t('orderedOn')}</p>
                  <p className="text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('orderSummary')}</CardTitle>
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

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => navigate('/tracking')}
          >
            <Package className="h-4 w-4 mr-2" />
            {t('trackOrder')}
          </Button>
          <Button 
            className="flex-1"
            onClick={() => navigate('/')}
          >
            {t('continueShopping')}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
