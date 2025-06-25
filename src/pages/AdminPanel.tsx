
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { Users, Video, Settings, Crown, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import AdminHeader from '@/components/admin/AdminHeader';
import CategoryManager from '@/components/admin/CategoryManager';
import ApiVideoUpload from '@/components/admin/ApiVideoUpload';
import ApiKeyManager from '@/components/admin/ApiKeyManager';
import ApiDocumentation from '@/components/admin/ApiDocumentation';

const AdminPanel = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/auth');
      return;
    }

    if (isAdmin) {
      fetchCategories();
      fetchVideos();
      fetchUsers();
    }
  }, [user, isAdmin, loading, navigate]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          categories(name, color),
          profiles(username)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const toggleUserPremium = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_premium: !currentStatus })
        .eq('id', userId);

      if (error) throw error;
      
      fetchUsers();
      toast.success(`User premium status ${!currentStatus ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const toggleVideoStatus = async (videoId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('videos')
        .update({ is_active: !currentStatus })
        .eq('id', videoId);

      if (error) throw error;
      
      fetchVideos();
      toast.success(`Video ${!currentStatus ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Error updating video:', error);
      toast.error('Failed to update video');
    }
  };

  const deleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId);

      if (error) throw error;
      
      fetchVideos();
      toast.success('Video deleted successfully');
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('Failed to delete video');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Tabs defaultValue="overview" className="space-y-8">
          <div className="bg-card rounded-lg p-1 shadow-sm">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto">
              <TabsTrigger value="overview" className="text-xs lg:text-sm py-3">
                Overview
              </TabsTrigger>
              <TabsTrigger value="videos" className="text-xs lg:text-sm py-3">
                Videos
              </TabsTrigger>
              <TabsTrigger value="users" className="text-xs lg:text-sm py-3">
                Users
              </TabsTrigger>
              <TabsTrigger value="categories" className="text-xs lg:text-sm py-3">
                Categories
              </TabsTrigger>
              <TabsTrigger value="upload" className="text-xs lg:text-sm py-3">
                Upload
              </TabsTrigger>
              <TabsTrigger value="api-upload" className="text-xs lg:text-sm py-3">
                API Upload
              </TabsTrigger>
              <TabsTrigger value="api-keys" className="text-xs lg:text-sm py-3">
                API Keys
              </TabsTrigger>
              <TabsTrigger value="api-docs" className="text-xs lg:text-sm py-3">
                API Docs
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="glass-effect">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
                  <Video className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{videos.length}</div>
                </CardContent>
              </Card>

              <Card className="glass-effect">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                </CardContent>
              </Card>

              <Card className="glass-effect">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
                  <Crown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {users.filter(u => u.is_premium).length}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{categories.length}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-6">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Video Management</CardTitle>
                <CardDescription>Manage all videos on your platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {videos.map((video) => (
                    <div key={video.id} className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 border rounded-lg gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{video.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            {video.view_count} views
                          </Badge>
                          {video.is_premium && (
                            <Badge className="bg-yellow-500/20 text-yellow-500 text-xs">
                              <Crown className="h-3 w-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                          {video.categories && (
                            <Badge 
                              style={{ backgroundColor: `${video.categories.color}20`, color: video.categories.color }}
                              className="text-xs"
                            >
                              {video.categories.name}
                            </Badge>
                          )}
                          <Badge variant={video.is_active ? "default" : "secondary"} className="text-xs">
                            {video.is_active ? "Active" : "Inactive"}
                          </Badge>
                          {video.slug && (
                            <Badge variant="outline" className="text-xs">
                              /{video.slug}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/${video.slug}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleVideoStatus(video.id, video.is_active)}
                        >
                          {video.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteVideo(video.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {videos.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No videos uploaded yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {users.map((user) => (
                    <div key={user.id} className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 border rounded-lg gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{user.email}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          {user.is_admin && (
                            <Badge variant="destructive" className="text-xs">Admin</Badge>
                          )}
                          {user.is_premium && (
                            <Badge className="bg-yellow-500/20 text-yellow-500 text-xs">
                              <Crown className="h-3 w-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                          <span className="text-sm text-muted-foreground">
                            Joined {new Date(user.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Premium</span>
                          <Switch
                            checked={user.is_premium}
                            onCheckedChange={() => toggleUserPremium(user.id, user.is_premium)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {users.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No users registered yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <CategoryManager />
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Video Upload</CardTitle>
                <CardDescription>Upload new videos to your platform</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Traditional video upload form coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api-upload" className="space-y-6">
            <ApiVideoUpload onUploadSuccess={fetchVideos} />
          </TabsContent>

          <TabsContent value="api-keys" className="space-y-6">
            <ApiKeyManager />
          </TabsContent>

          <TabsContent value="api-docs" className="space-y-6">
            <ApiDocumentation />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
