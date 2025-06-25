
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ThumbsUp, ThumbsDown, Eye, Clock, Crown } from 'lucide-react';
import { toast } from 'sonner';

interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  view_count: number;
  like_count: number;
  dislike_count: number;
  is_premium: boolean;
  duration: number;
  categories: { name: string; color: string } | null;
  profiles: { username: string } | null;
}

interface Comment {
  id: string;
  content: string;
  like_count: number;
  created_at: string;
  profiles: { username: string } | null;
}

const VideoWatch = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isPremium } = useAuth();
  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchVideo(id);
      fetchComments(id);
      recordView(id);
    }
  }, [id]);

  const fetchVideo = async (videoId: string) => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          categories(name, color),
          profiles(username)
        `)
        .eq('id', videoId)
        .single();

      if (error) throw error;
      setVideo(data);
    } catch (error) {
      console.error('Error fetching video:', error);
      toast.error('Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (videoId: string) => {
    try {
      const { data, error } = await supabase
        .from('video_comments')
        .select(`
          *,
          profiles(username)
        `)
        .eq('video_id', videoId)
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const recordView = async (videoId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('video_views')
        .upsert({ 
          video_id: videoId, 
          user_id: user.id,
          viewed_at: new Date().toISOString()
        });

      // Update view count
      await supabase.rpc('increment_view_count', { video_id: videoId });
    } catch (error) {
      console.error('Error recording view:', error);
    }
  };

  const addComment = async () => {
    if (!user || !newComment.trim() || !id) return;

    try {
      const { error } = await supabase
        .from('video_comments')
        .insert({
          video_id: id,
          user_id: user.id,
          content: newComment.trim()
        });

      if (error) throw error;

      setNewComment('');
      fetchComments(id);
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading video...</div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Video not found</h2>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (video.is_premium && !isPremium) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full glass-effect text-center">
          <CardHeader>
            <Crown className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <CardTitle>Premium Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>This video requires a premium subscription to view.</p>
            <Button className="w-full neon-glow">
              Upgrade to Premium
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
              <video
                src={video.video_url}
                controls
                className="w-full h-full"
                poster={video.thumbnail_url || undefined}
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video Info */}
            <Card className="glass-effect">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {video.view_count} views
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDuration(video.duration)}
                      </div>
                      {video.profiles?.username && (
                        <span>by {video.profiles.username}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {video.is_premium && (
                      <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                    {video.categories && (
                      <Badge 
                        style={{ backgroundColor: `${video.categories.color}20`, color: video.categories.color }}
                      >
                        {video.categories.name}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {video.like_count}
                  </Button>
                  <Button variant="outline" size="sm">
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    {video.dislike_count}
                  </Button>
                </div>

                {video.description && (
                  <p className="text-muted-foreground">{video.description}</p>
                )}
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card className="glass-effect mt-6">
              <CardHeader>
                <CardTitle>Comments ({comments.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {user && (
                  <div className="mb-6">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="mb-2 glass-effect"
                    />
                    <Button onClick={addComment} disabled={!newComment.trim()}>
                      Add Comment
                    </Button>
                  </div>
                )}

                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-b border-border pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">
                          {comment.profiles?.username || 'Anonymous'}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{comment.content}</p>
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        {comment.like_count}
                      </Button>
                    </div>
                  ))}
                  
                  {comments.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No comments yet. Be the first to comment!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar with related videos */}
          <div className="lg:col-span-1">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Related Videos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Related videos coming soon...
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoWatch;
