
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Loader2 } from 'lucide-react';
import { useVideoUpload } from '@/hooks/useVideoUpload';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Category {
  id: string;
  name: string;
  color: string;
}

const VideoUploadForm = ({ onUploadSuccess }: { onUploadSuccess?: () => void }) => {
  const { user } = useAuth();
  const { uploadVideo, uploading } = useVideoUpload();
  const [categories, setCategories] = useState<Category[]>([]);
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
        .eq('is_active', true);

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.title || !formData.video_url || !formData.category_id) {
      return;
    }

    const result = await uploadVideo(formData, user.id);
    
    if (result.data) {
      setFormData({
        title: '',
        description: '',
        video_url: '',
        thumbnail_url: '',
        duration: 0,
        category_id: '',
        is_premium: false
      });
      onUploadSuccess?.();
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Video hochladen
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Titel *</label>
            <Input
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Video Titel eingeben..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Beschreibung</label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Video Beschreibung..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Video URL *</label>
            <Input
              value={formData.video_url}
              onChange={(e) => handleInputChange('video_url', e.target.value)}
              placeholder="https://example.com/video.mp4"
              type="url"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Thumbnail URL</label>
            <Input
              value={formData.thumbnail_url}
              onChange={(e) => handleInputChange('thumbnail_url', e.target.value)}
              placeholder="https://example.com/thumbnail.jpg"
              type="url"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Dauer (Sekunden) *</label>
            <Input
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
              placeholder="600"
              type="number"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Kategorie *</label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => handleInputChange('category_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Kategorie auswählen..." />
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

          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.is_premium}
              onCheckedChange={(checked) => handleInputChange('is_premium', checked)}
            />
            <label className="text-sm font-medium">Premium Content</label>
          </div>

          <Button 
            type="submit" 
            className="w-full neon-glow" 
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Wird hochgeladen...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Video hochladen
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VideoUploadForm;
