'use client';

import Link from 'next/link';
import { Heart, ExternalLink, Info, Star } from 'lucide-react';

import { cn } from '@/lib/utils';
import { AITool } from '@/types/ai-tools';
import { useAIToolStore } from '@/lib/store/ai-tools-store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

interface AIToolCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tool: AITool;
  variant?: 'default' | 'compact';
}

export function AIToolCard({ 
  tool, 
  variant = 'default', 
  className,
  ...props 
}: AIToolCardProps) {
  const { userPreferences, addToFavorites, removeFromFavorites, addRecentTool } = useAIToolStore();
  const isFavorite = userPreferences.favoriteTools.includes(tool.id);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorite) {
      removeFromFavorites(tool.id);
    } else {
      addToFavorites(tool.id);
    }
  };

  const handleToolClick = () => {
    addRecentTool(tool.id);
  };

  if (variant === 'compact') {
    return (
      <Card className={cn('w-full overflow-hidden', className)} {...props}>
        <div className="flex items-center p-3">
          <div className="flex-shrink-0 h-10 w-10 mr-3">
            <div className="h-full w-full rounded bg-muted flex items-center justify-center">
              <span className="font-medium text-xs">{tool.name.substring(0, 2)}</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <Link href={`/tool/${tool.id}`} onClick={handleToolClick} className="block">
              <CardTitle className="text-sm truncate">{tool.name}</CardTitle>
              <CardDescription className="text-xs truncate">
                {tool.description}
              </CardDescription>
            </Link>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={handleFavoriteToggle}
            >
              <Heart 
                className={cn('h-4 w-4', isFavorite ? 'fill-current text-red-500' : '')} 
              />
              <span className="sr-only">Add to favorites</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              asChild
            >
              <Link href={tool.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Visit website</span>
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn('overflow-hidden', className)} {...props}>
      <Link 
        href={`/tool/${tool.id}`} 
        onClick={handleToolClick}
        className="block h-full cursor-pointer"
      >
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                <span className="font-medium text-sm">{tool.name.substring(0, 2)}</span>
              </div>
              <div>
                <CardTitle className="text-lg">{tool.name}</CardTitle>
                {tool.accessLevel && (
                  <div className="mt-1">
                    <Badge variant={
                      tool.accessLevel === 'free' ? 'secondary' :
                      tool.accessLevel === 'freemium' ? 'outline' : 'default'
                    }>
                      {tool.accessLevel.charAt(0).toUpperCase() + tool.accessLevel.slice(1)}
                    </Badge>
                    {tool.isNew && <Badge variant="outline" className="ml-2">New</Badge>}
                    {tool.isTrending && <Badge className="ml-2">Trending</Badge>}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={handleFavoriteToggle}
              >
                <Heart 
                  className={cn('h-5 w-5', isFavorite ? 'fill-current text-red-500' : '')} 
                />
                <span className="sr-only">Add to favorites</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <CardDescription className="line-clamp-2 h-10">
            {tool.description}
          </CardDescription>
          
          <div className="mt-4 flex flex-wrap gap-1">
            {tool.categories.slice(0, 3).map((category) => (
              <Badge key={category} variant="secondary" className="text-xs">
                {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Badge>
            ))}
            {tool.categories.length > 3 && (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Badge variant="outline" className="text-xs cursor-help">
                    +{tool.categories.length - 3} more
                  </Badge>
                </HoverCardTrigger>
                <HoverCardContent className="w-auto">
                  <div className="flex flex-wrap gap-1">
                    {tool.categories.slice(3).map((category) => (
                      <Badge key={category} variant="secondary" className="text-xs">
                        {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Badge>
                    ))}
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
          
          {tool.rating && (
            <div className="mt-3 flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={cn(
                      'h-3.5 w-3.5', 
                      i < Math.floor(tool.rating || 0) 
                        ? 'fill-current text-yellow-500' 
                        : 'text-muted-foreground'
                    )} 
                  />
                ))}
              </div>
              <span className="ml-1 text-xs text-muted-foreground">
                {tool.rating} ({tool.reviewCount?.toLocaleString()})
              </span>
            </div>
          )}
        </CardContent>
      </Link>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          asChild
        >
          <Link href={tool.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
            <ExternalLink className="h-3.5 w-3.5 mr-1" /> Visit Website
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          asChild
        >
          <Link href={`/tool/${tool.id}`}>
            <Info className="h-4 w-4" />
            <span className="sr-only">View details</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
