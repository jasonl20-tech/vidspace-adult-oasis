
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, PlaySquare, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface Playlist {
  id: string;
  name: string;
  description: string;
  is_public: boolean;
  created_at: string;
  video_count?: number;
}

const PlaylistManager = () => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');

  useEffect(() => {
    if (user) {
      fetchPlaylists();
    }
  }, [user]);

  const fetchPlaylists = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlaylists(data || []);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      toast.error('Failed to load playlists');
    }
  };

  const createPlaylist = async () => {
    if (!user || !newPlaylistName.trim()) return;

    try {
      const { error } = await supabase
        .from('playlists')
        .insert({
          name: newPlaylistName.trim(),
          description: newPlaylistDescription.trim(),
          user_id: user.id,
          is_public: false
        });

      if (error) throw error;
      
      toast.success('Playlist created successfully');
      setNewPlaylistName('');
      setNewPlaylistDescription('');
      setIsDialogOpen(false);
      fetchPlaylists();
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast.error('Failed to create playlist');
    }
  };

  const deletePlaylist = async (playlistId: string) => {
    if (!confirm('Are you sure you want to delete this playlist?')) return;

    try {
      const { error } = await supabase
        .from('playlists')
        .delete()
        .eq('id', playlistId);

      if (error) throw error;
      
      toast.success('Playlist deleted successfully');
      fetchPlaylists();
    } catch (error) {
      console.error('Error deleting playlist:', error);
      toast.error('Failed to delete playlist');
    }
  };

  if (!user) {
    return (
      <Card className="glass-effect">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Please login to manage playlists</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <PlaySquare className="h-5 w-5" />
            My Playlists
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Playlist
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Playlist</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Playlist name"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    placeholder="Description (optional)"
                    value={newPlaylistDescription}
                    onChange={(e) => setNewPlaylistDescription(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={createPlaylist} className="flex-1">
                    Create
                  </Button>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {playlists.length === 0 ? (
          <div className="text-center py-8">
            <PlaySquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No playlists yet. Create your first playlist!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map((playlist) => (
              <div key={playlist.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold truncate">{playlist.name}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deletePlaylist(playlist.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                {playlist.description && (
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {playlist.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    <Eye className="w-3 h-3 mr-1" />
                    {playlist.is_public ? 'Public' : 'Private'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {playlist.video_count || 0} videos
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlaylistManager;
