
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, Link, Download } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  color: string;
}

const ApiVideoUpload = ({ onUploadSuccess }: { onUploadSuccess: () => void }) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
    duration: 0,
    category_id: '',
    is_premium: false
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, color')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const extractVideoMetadata = async (url: string) => {
    // Basic URL validation
    try {
      new URL(url);
    } catch {
      toast.error('Please enter a valid URL');
      return null;
    }

    // For demo purposes, we'll use placeholder metadata
    // In a real implementation, you'd integrate with video APIs
    const metadata = {
      title: `Video from ${new URL(url).hostname}`,
      description: 'Video imported via URL',
      duration: 300, // 5 minutes default
      thumbnail_url: `https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=600&h=400&fit=crop`
    };

    return metadata;
  };

  const handleUrlImport = async () => {
    if (!formData.video_url) {
      toast.error('Please enter a video URL');
      return;
    }

    setLoading(true);
    try {
      const metadata = await extractVideoMetadata(formData.video_url);
      if (metadata) {
        setFormData(prev => ({
          ...prev,
          title: prev.title || metadata.title,
          description: prev.description || metadata.description,
          duration: metadata.duration,
          thumbnail_url: prev.thumbnail_url || metadata.thumbnail_url
        }));
        toast.success('Video metadata extracted successfully');
      }
    } catch (error) {
      console.error('Error extracting metadata:', error);
      toast.error('Failed to extract video metadata');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.title || !formData.video_url || !formData.category_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const slug = generateSlug(formData.title);
      
      // Check if slug already exists
      const { data: existingVideo } = await supabase
        .from('videos')
        .select('id')
        .eq('slug', slug)
        .single();

      const finalSlug = existingVideo ? `${slug}-${Date.now()}` : slug;

      const { error } = await supabase
        .from('videos')
        .insert({
          ...formData,
          slug: finalSlug,
          uploader_id: user.id,
          is_active: true,
          view_count: 0,
          like_count: 0,
          dislike_count: 0
        });

      if (error) throw error;

      toast.success('Video uploaded successfully');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        video_url: '',
        thumbnail_url: '',
        duration: 0,
        category_id: '',
        is_premium: false
      });
      
      onUploadSuccess();
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Failed to upload video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          API Video Upload
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Import videos from external URLs and manage metadata
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="video_url">Video URL *</Label>
                <div className="flex gap-2">
                  <Input
                    id="video_url"
                    type="url"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    placeholder="https://example.com/video.mp4"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleUrlImport}
                    disabled={loading || !formData.video_url}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
                <Input
                  id="thumbnail_url"
                  type="url"
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  placeholder="https://example.com/thumbnail.jpg"
                />
                {formData.thumbnail_url && (
                  <div className="mt-2">
                    <img 
                      src={formData.thumbnail_url} 
                      alt="Thumbnail preview"
                      className="w-full h-32 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="duration">Duration (seconds)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.category_id} 
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="premium">Premium Content</Label>
                <Switch
                  id="premium"
                  checked={formData.is_premium}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_premium: checked })}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload Video'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ApiVideoUpload;
