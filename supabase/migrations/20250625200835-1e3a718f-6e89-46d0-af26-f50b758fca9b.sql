
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#ef4444',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create videos table
CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  video_url TEXT NOT NULL,
  duration INTEGER, -- in seconds
  file_size BIGINT,
  category_id UUID REFERENCES public.categories(id),
  uploader_id UUID REFERENCES public.profiles(id),
  is_premium BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  dislike_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create video comments table
CREATE TABLE public.video_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.video_comments(id),
  like_count INTEGER DEFAULT 0,
  dislike_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create video views table
CREATE TABLE public.video_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  watch_duration INTEGER DEFAULT 0, -- in seconds
  UNIQUE(video_id, user_id)
);

-- Create user subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'inactive',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create playlists table
CREATE TABLE public.playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create playlist videos junction table
CREATE TABLE public.playlist_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  playlist_id UUID REFERENCES public.playlists(id) ON DELETE CASCADE,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
  position INTEGER,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(playlist_id, video_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_videos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Enable insert for authenticated users" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for categories
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Only admins can manage categories" ON public.categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Create RLS policies for videos
CREATE POLICY "Anyone can view active videos" ON public.videos FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage all videos" ON public.videos FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Users can upload videos" ON public.videos FOR INSERT WITH CHECK (
  auth.uid() = uploader_id
);

-- Create RLS policies for comments
CREATE POLICY "Anyone can view comments" ON public.video_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add comments" ON public.video_comments FOR INSERT WITH CHECK (
  auth.uid() = user_id
);
CREATE POLICY "Users can update own comments" ON public.video_comments FOR UPDATE USING (
  auth.uid() = user_id
);
CREATE POLICY "Users can delete own comments" ON public.video_comments FOR DELETE USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Create RLS policies for video views
CREATE POLICY "Users can view own watch history" ON public.video_views FOR SELECT USING (
  auth.uid() = user_id
);
CREATE POLICY "Users can record own views" ON public.video_views FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

-- Create RLS policies for subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.user_subscriptions FOR SELECT USING (
  auth.uid() = user_id
);
CREATE POLICY "Users can manage own subscriptions" ON public.user_subscriptions FOR ALL USING (
  auth.uid() = user_id
);

-- Create RLS policies for playlists
CREATE POLICY "Users can view public playlists and own playlists" ON public.playlists FOR SELECT USING (
  is_public = true OR auth.uid() = user_id
);
CREATE POLICY "Users can manage own playlists" ON public.playlists FOR ALL USING (
  auth.uid() = user_id
);

-- Create RLS policies for playlist videos
CREATE POLICY "Users can view playlist videos if they can view the playlist" ON public.playlist_videos FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.playlists 
    WHERE id = playlist_id AND (is_public = true OR user_id = auth.uid())
  )
);
CREATE POLICY "Users can manage own playlist videos" ON public.playlist_videos FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.playlists 
    WHERE id = playlist_id AND user_id = auth.uid()
  )
);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    CASE WHEN NEW.email LIKE '%lohrejason5@gmail.com%' THEN true ELSE false END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert initial categories
INSERT INTO public.categories (name, description, icon, color) VALUES
('Amateur', 'Amateur content from real people', 'Heart', '#ef4444'),
('Premium', 'High quality premium content', 'Crown', '#eab308'),
('HD', 'High definition videos', 'Zap', '#3b82f6'),
('4K', 'Ultra high definition content', 'Star', '#8b5cf6'),
('VR', 'Virtual reality experiences', 'Video', '#10b981'),
('Live', 'Live streaming content', 'Camera', '#ef4444'),
('Couples', 'Content featuring couples', 'Users', '#f97316'),
('ASMR', 'Audio sensory content', 'Music', '#6366f1'),
('Interactive', 'Interactive experiences', 'Gamepad2', '#06b6d4'),
('Anime', 'Animated content', 'Palette', '#ec4899'),
('Fetish', 'Specialized content', 'Coffee', '#f59e0b');
