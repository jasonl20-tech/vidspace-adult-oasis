
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Extract API key from Authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid Authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const apiKey = authHeader.replace('Bearer ', '')

    // Validate API key
    const keyHash = btoa(apiKey) // Simple base64 encoding for demo
    const { data: keyData, error: keyError } = await supabaseClient
      .from('api_keys')
      .select('user_id, is_active')
      .eq('key_hash', keyHash)
      .eq('is_active', true)
      .single()

    if (keyError || !keyData) {
      return new Response(
        JSON.stringify({ error: 'Invalid or inactive API key' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Update last_used_at
    await supabaseClient
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('key_hash', keyHash)

    // Parse request body
    const body = await req.json()
    const { title, description, video_url, thumbnail_url, duration, category_id, is_premium } = body

    // Validate required fields
    if (!title || !video_url || !category_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: title, video_url, category_id' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Generate slug
    const { data: slugData, error: slugError } = await supabaseClient
      .rpc('generate_slug', { title })

    if (slugError) {
      return new Response(
        JSON.stringify({ error: 'Failed to generate slug' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Insert video
    const { data: videoData, error: videoError } = await supabaseClient
      .from('videos')
      .insert({
        title,
        description: description || null,
        video_url,
        thumbnail_url: thumbnail_url || null,
        duration: duration || 0,
        category_id,
        is_premium: is_premium || false,
        slug: slugData,
        uploader_id: keyData.user_id,
        is_active: true,
        view_count: 0,
        like_count: 0,
        dislike_count: 0
      })
      .select()
      .single()

    if (videoError) {
      console.error('Video insert error:', videoError)
      return new Response(
        JSON.stringify({ error: 'Failed to create video', details: videoError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        video: videoData,
        message: 'Video uploaded successfully' 
      }),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('API error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
