import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Loader2, Link, File } from 'lucide-react';
import { useVideoUpload } from '@/hooks/useVideoUpload';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  color: string;
}

const VideoUploadForm = ({ onUploadSuccess }: { onUploadSuccess?: () => void }) => {
  const { user } = useAuth();
  const { uploadVideo, uploading } = useVideoUpload();
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
    duration: 0,
    category_id: '',
    is_premium: false
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const handleFileUpload = async (file: File) => {
    if (!user) {
      toast.error('Sie müssen angemeldet sein, um Dateien hochzuladen');
      return null;
    }

    console.log('Starting file upload for user:', user.id);
    setUploadingFile(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log('Uploading file to path:', filePath);
      console.log('File size:', file.size, 'bytes');
      console.log('File type:', file.type);

      const { data, error } = await supabase.storage
        .from('videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error details:', error);
        throw error;
      }

      console.log('Upload successful:', data);

      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      console.log('Public URL generated:', publicUrl);
      toast.success('Datei erfolgreich hochgeladen!');
      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading file:', error);
      
      // More specific error messages
      if (error.message?.includes('Row Level Security')) {
        toast.error('Fehler: Keine Berechtigung zum Hochladen. Bitte melden Sie sich erneut an.');
      } else if (error.message?.includes('payload too large')) {
        toast.error('Fehler: Datei ist zu groß');
      } else if (error.message?.includes('bucket')) {
        toast.error('Fehler: Storage-Bucket nicht verfügbar');
      } else {
        toast.error(`Fehler beim Hochladen: ${error.message || 'Unbekannter Fehler'}`);
      }
      
      return null;
    } finally {
      setUploadingFile(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('video/')) {
      toast.error('Bitte wählen Sie eine gültige Videodatei aus');
      return;
    }

    // Check file size (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > maxSize) {
      toast.error('Die Datei ist zu groß. Maximum: 100MB');
      return;
    }

    setSelectedFile(file);
    
    // Auto-fill title if empty
    if (!formData.title) {
      const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
      setFormData(prev => ({ ...prev, title: fileName }));
    }

    // Try to get video duration
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      if (video.duration && !isNaN(video.duration)) {
        setFormData(prev => ({ ...prev, duration: Math.round(video.duration) }));
      }
      window.URL.revokeObjectURL(video.src);
    };
    video.src = URL.createObjectURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Sie müssen angemeldet sein');
      return;
    }

    let videoUrl = formData.video_url;

    // If file is selected, upload it first
    if (selectedFile) {
      console.log('Uploading selected file...');
      videoUrl = await handleFileUpload(selectedFile);
      if (!videoUrl) {
        console.log('File upload failed, aborting video creation');
        return;
      }
    }

    if (!formData.title || !videoUrl || !formData.category_id) {
      toast.error('Bitte füllen Sie alle Pflichtfelder aus');
      return;
    }

    console.log('Creating video record with URL:', videoUrl);
    const result = await uploadVideo({
      ...formData,
      video_url: videoUrl
    }, user.id);
    
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
      setSelectedFile(null);
      onUploadSuccess?.();
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isLoading = uploading || uploadingFile;

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Video hochladen
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file" className="flex items-center gap-2">
              <File className="h-4 w-4" />
              Datei hochladen
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              URL eingeben
            </TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <TabsContent value="file" className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Video-Datei auswählen *</label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="video-file"
                  />
                  <label htmlFor="video-file" className="cursor-pointer">
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          {selectedFile ? selectedFile.name : 'Videodatei auswählen'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          MP4, AVI, MOV, WMV (max. 100MB)
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
                {selectedFile && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Größe: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Video URL *</label>
                <Input
                  value={formData.video_url}
                  onChange={(e) => handleInputChange('video_url', e.target.value)}
                  placeholder="https://example.com/video.mp4"
                  type="url"
                />
              </div>
            </TabsContent>

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
              <label className="block text-sm font-medium mb-2">Thumbnail URL</label>
              <Input
                value={formData.thumbnail_url}
                onChange={(e) => handleInputChange('thumbnail_url', e.target.value)}
                placeholder="https://example.com/thumbnail.jpg"
                type="url"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Dauer (Sekunden)</label>
              <Input
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                placeholder="600"
                type="number"
                min="0"
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
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {uploadingFile ? 'Datei wird hochgeladen...' : 'Video wird verarbeitet...'}
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Video hochladen
                </>
              )}
            </Button>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default VideoUploadForm;
