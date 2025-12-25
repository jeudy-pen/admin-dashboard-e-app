import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, FolderOpen, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Category {
  id: string;
  name: string;
  name_kh: string;
  description: string;
  image_url: string;
  created_at: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    name_kh: '',
    description: '',
    image_url: ''
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setCategories(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const categoryData = {
      name: formData.name,
      name_kh: formData.name_kh,
      description: formData.description,
      image_url: formData.image_url
    };

    let error;
    if (editingCategory) {
      ({ error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', editingCategory.id));
    } else {
      ({ error } = await supabase.from('categories').insert(categoryData));
    }

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: editingCategory ? 'Category updated' : 'Category created' });
      setIsDialogOpen(false);
      resetForm();
      fetchCategories();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Deleted', description: 'Category has been deleted' });
      fetchCategories();
    }
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      name_kh: category.name_kh || '',
      description: category.description || '',
      image_url: category.image_url || ''
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({ name: '', name_kh: '', description: '', image_url: '' });
  };

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Categories</h1>
            <p className="text-muted-foreground">Manage product categories</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Name (English)</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Name (Khmer)</Label>
                  <Input
                    value={formData.name_kh}
                    onChange={(e) => setFormData({ ...formData, name_kh: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
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
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No categories found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredCategories.map((category) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FolderOpen className="h-8 w-8 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{category.name}</h3>
                      {category.name_kh && (
                        <p className="text-sm text-muted-foreground">{category.name_kh}</p>
                      )}
                      {category.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{category.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-border">
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(category)}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(category.id)}>
                      <Trash2 className="h-4 w-4 mr-1 text-destructive" /> Delete
                    </Button>
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
