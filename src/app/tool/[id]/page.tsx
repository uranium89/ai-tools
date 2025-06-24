'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ExternalLink, ArrowLeft, Star, CheckCircle, XCircle } from 'lucide-react';
import { notFound, useParams } from 'next/navigation';

import { cn } from '@/lib/utils';
import { AITool } from '@/types/ai-tools';
import { useAIToolStore } from '@/lib/store/ai-tools-store';
import { MOCK_AI_TOOLS } from '@/lib/data/mock-tools';

import { MainLayout } from '@/components/layout/main-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ToolDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  
  const { tools, setTools, userPreferences, addToFavorites, removeFromFavorites, addRecentTool } = useAIToolStore();
  const [tool, setTool] = useState<AITool | null>(null);
  const isFavorite = userPreferences.favoriteTools.includes(id);

  useEffect(() => {
    // Load mock tools if needed
    if (tools.length === 0) {
      setTools(MOCK_AI_TOOLS);
    }
    
    // Find the tool by ID
    const foundTool = tools.find(t => t.id === id) || 
                   MOCK_AI_TOOLS.find(t => t.id === id);
    
    if (foundTool) {
      setTool(foundTool);
      addRecentTool(foundTool.id);
    }
  }, [id, tools, setTools, addRecentTool]);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFromFavorites(id);
    } else {
      addToFavorites(id);
    }
  };

  if (!tool) {
    return notFound();
  }

  return (
    <MainLayout showSidebar={false}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 mb-4"
            asChild
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to tools
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded bg-muted flex items-center justify-center">
                <span className="font-bold text-2xl">{tool.name.substring(0, 2)}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold">{tool.name}</h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tool.accessLevel && (
                    <Badge variant={
                      tool.accessLevel === 'free' ? 'secondary' : 
                      tool.accessLevel === 'freemium' ? 'outline' : 'default'
                    }>
                      {tool.accessLevel.charAt(0).toUpperCase() + tool.accessLevel.slice(1)}
                    </Badge>
                  )}
                  {tool.isNew && <Badge variant="outline">New</Badge>}
                  {tool.isTrending && <Badge>Trending</Badge>}
                  {tool.apiAvailable && <Badge variant="secondary">API Available</Badge>}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline"
                className="gap-2"
                onClick={handleFavoriteToggle}
              >
                <Heart className={cn('h-4 w-4', isFavorite ? 'fill-current text-red-500' : '')} />
                {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              </Button>
              <Button asChild>
                <a href={tool.url} target="_blank" rel="noopener noreferrer" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Visit Website
                </a>
              </Button>
            </div>
          </div>
          
          <div className="prose dark:prose-invert max-w-none mb-8">
            <p className="text-lg">{tool.description}</p>
          </div>
          
          <Separator className="my-8" />
          
          <Tabs defaultValue="features">
            <TabsList className="grid w-full md:w-auto grid-cols-3 mb-6">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="features" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Key Features</CardTitle>
                  <CardDescription>What makes {tool.name} special</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tool.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tool Details</CardTitle>
                  <CardDescription>Technical information about {tool.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium mb-1">Categories</h3>
                        <div className="flex flex-wrap gap-1">
                          {tool.categories.map((category) => (
                            <Badge key={category} variant="outline">
                              {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-1">Access Level</h3>
                        <Badge variant={
                          tool.accessLevel === 'free' ? 'secondary' : 
                          tool.accessLevel === 'freemium' ? 'outline' : 'default'
                        }>
                          {tool.accessLevel.charAt(0).toUpperCase() + tool.accessLevel.slice(1)}
                        </Badge>
                        
                        {tool.pricingUrl && (
                          <div className="mt-2">
                            <Link 
                              href={tool.pricingUrl} 
                              target="_blank"
                              className="text-sm text-blue-500 hover:underline"
                            >
                              View pricing details
                            </Link>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-1">API Available</h3>
                        <div className="flex items-center gap-1">
                          {tool.apiAvailable ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>Yes</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-500" />
                              <span>No</span>
                            </>
                          )}
                        </div>
                        
                        {tool.apiUrl && (
                          <div className="mt-2">
                            <Link 
                              href={tool.apiUrl} 
                              target="_blank"
                              className="text-sm text-blue-500 hover:underline"
                            >
                              View API documentation
                            </Link>
                          </div>
                        )}
                      </div>
                      
                      {tool.tags && tool.tags.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium mb-1">Tags</h3>
                          <div className="flex flex-wrap gap-1">
                            {tool.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Reviews</CardTitle>
                  <CardDescription>
                    {tool.reviewCount 
                      ? `Based on ${tool.reviewCount.toLocaleString()} reviews` 
                      : 'No reviews available yet'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {tool.rating ? (
                    <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
                      <div className="flex flex-col items-center">
                        <div className="text-5xl font-bold">{tool.rating.toFixed(1)}</div>
                        <div className="flex mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={cn(
                                'h-5 w-5', 
                                i < Math.floor(tool.rating || 0) 
                                  ? 'fill-current text-yellow-500' 
                                  : 'text-muted-foreground'
                              )} 
                            />
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {tool.reviewCount?.toLocaleString()} reviews
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="space-y-2">
                          {/* This would normally be populated with actual review data */}
                          <p className="text-muted-foreground text-center md:text-left">
                            Detailed reviews would be shown here in a real implementation.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-6">
                      No reviews available yet for this tool.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <Separator className="my-8" />
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Similar Tools</h2>
          <p className="text-muted-foreground mb-6">
            Users who explored {tool.name} also liked these tools
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Similar tools would go here - in a real implementation, filter similar tools */}
            <Card className="p-4 flex flex-col justify-center items-center h-40">
              <CardDescription>Similar tools would be shown here based on categories and user behavior.</CardDescription>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
