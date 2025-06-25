
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Book, Code, ExternalLink } from 'lucide-react';

const ApiDocumentation = () => {
  const apiEndpoint = `${window.location.origin}/api/videos`;

  return (
    <div className="space-y-6">
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            API Documentation
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Learn how to integrate with the Video Platform API
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Authentication</h3>
            <p className="text-sm text-muted-foreground mb-2">
              All API requests must include your API key in the Authorization header:
            </p>
            <div className="bg-muted p-3 rounded-lg font-mono text-sm">
              Authorization: Bearer YOUR_API_KEY
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3">Upload Video</h3>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default">POST</Badge>
              <code className="text-sm">{apiEndpoint}</code>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Upload a new video to the platform
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Request Headers</h4>
                <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                  Content-Type: application/json<br/>
                  Authorization: Bearer YOUR_API_KEY
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Request Body</h4>
                <div className="bg-muted p-3 rounded-lg font-mono text-sm overflow-x-auto">
{`{
  "title": "Video Title (required)",
  "description": "Video description (optional)",
  "video_url": "https://example.com/video.mp4 (required)",
  "thumbnail_url": "https://example.com/thumb.jpg (optional)",
  "duration": 300,
  "category_id": "uuid-of-category (required)",
  "is_premium": false
}`}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Success Response (201)</h4>
                <div className="bg-muted p-3 rounded-lg font-mono text-sm overflow-x-auto">
{`{
  "success": true,
  "message": "Video uploaded successfully",
  "video": {
    "id": "uuid",
    "title": "Video Title",
    "slug": "video-title",
    "video_url": "https://example.com/video.mp4",
    "thumbnail_url": "https://example.com/thumb.jpg",
    "duration": 300,
    "is_premium": false,
    "created_at": "2024-01-01T00:00:00Z"
  }
}`}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Error Response (400/401/500)</h4>
                <div className="bg-muted p-3 rounded-lg font-mono text-sm overflow-x-auto">
{`{
  "error": "Error message",
  "details": "Additional error details (optional)"
}`}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3">Example Usage</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">cURL</h4>
                <div className="bg-muted p-3 rounded-lg font-mono text-xs overflow-x-auto">
{`curl -X POST "${apiEndpoint}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "title": "My Video",
    "description": "A great video",
    "video_url": "https://example.com/video.mp4",
    "thumbnail_url": "https://example.com/thumb.jpg",
    "duration": 300,
    "category_id": "uuid-of-category",
    "is_premium": false
  }'`}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">JavaScript</h4>
                <div className="bg-muted p-3 rounded-lg font-mono text-xs overflow-x-auto">
{`const response = await fetch('${apiEndpoint}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    title: 'My Video',
    description: 'A great video',
    video_url: 'https://example.com/video.mp4',
    thumbnail_url: 'https://example.com/thumb.jpg',
    duration: 300,
    category_id: 'uuid-of-category',
    is_premium: false
  })
});

const data = await response.json();
console.log(data);`}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Python</h4>
                <div className="bg-muted p-3 rounded-lg font-mono text-xs overflow-x-auto">
{`import requests

url = "${apiEndpoint}"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
}
data = {
    "title": "My Video",
    "description": "A great video",
    "video_url": "https://example.com/video.mp4",
    "thumbnail_url": "https://example.com/thumb.jpg",
    "duration": 300,
    "category_id": "uuid-of-category",
    "is_premium": False
}

response = requests.post(url, json=data, headers=headers)
print(response.json())`}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiDocumentation;
