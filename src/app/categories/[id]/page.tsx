'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound, useParams } from 'next/navigation';

import { MainLayout } from '@/components/layout/main-layout';
import { AIToolsGrid } from '@/components/ai-tools/ai-tools-grid';
import { Button } from '@/components/ui/button';
import { useAIToolStore } from '@/lib/store/ai-tools-store';
import { MOCK_AI_TOOLS } from '@/lib/data/mock-tools';
import { TOOL_CATEGORIES } from '@/lib/data/mock-tools';
import { ToolCategory } from '@/types/ai-tools';

export default function CategoryPage() {
  // Get params from the URL in client components
  const params = useParams();
  const idParam = params.id as string;
  const { setTools, tools } = useAIToolStore();
  const [isLoading, setIsLoading] = useState(true);
  const categoryId = idParam as ToolCategory;
  
  // Get category details
  const category = TOOL_CATEGORIES.find(c => c.id === categoryId);
  
  // Load mock tools on component mount
  useEffect(() => {
    setIsLoading(true);
    
    // Only load if we don't have tools already
    if (tools.length === 0) {
      setTools(MOCK_AI_TOOLS);
    }
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [setTools, tools.length]);
  
  // Handle invalid category
  if (!category) {
    return notFound();
  }
  
  // Filter tools by category
  const categoryTools = tools.filter(tool => tool.categories.includes(categoryId));

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 mb-4"
          asChild
        >
          <Link href="/categories">
            <ArrowLeft className="h-4 w-4" />
            All Categories
          </Link>
        </Button>
        
        <h1 className="text-4xl font-bold mb-6">{category.label}</h1>
        <p className="text-lg text-muted-foreground mb-8">
          {getCategoryDescription(categoryId)}
        </p>
        
        <AIToolsGrid tools={categoryTools} isLoading={isLoading} />
      </div>
    </MainLayout>
  );
}

function getCategoryDescription(category: ToolCategory): string {
  switch (category) {
    case 'text-generation':
      return 'AI tools that create, edit and improve written content, from articles and stories to emails and code documentation.';
    case 'image-generation':
      return 'Tools that transform text prompts into visual art, illustrations, and photorealistic imagery.';
    case 'code-generation':
      return 'AI solutions that help developers write, review, and debug code across various programming languages.';
    case 'audio-generation':
      return 'Tools for creating synthetic speech, sound effects, music, and audio processing.';
    case 'video-generation':
      return 'AI systems that can create, edit, or enhance video content from text descriptions or existing footage.';
    case 'data-analysis':
      return 'Tools that help analyze, visualize, and derive insights from large datasets.';
    case 'language-translation':
      return 'AI-powered translation tools that convert text or speech between different languages.';
    case 'content-research':
      return 'Tools that help find, organize, and summarize information from various sources.';
    case 'marketing':
      return 'AI solutions designed to improve marketing campaigns, copywriting, and audience engagement.';
    case 'productivity':
      return 'Tools that streamline workflows, automate repetitive tasks, and increase efficiency.';
    case 'creativity':
      return 'AI systems that enhance or inspire creative work across various domains.';
    case 'business':
      return 'Tools designed to improve business operations, analysis, and decision-making.';
    case 'education':
      return 'AI solutions for learning, teaching, and educational content creation.';
    case 'development':
      return 'Tools designed specifically for developers, programmers, and technical workflows.';
    default:
      return 'Other innovative AI tools that span multiple categories or create new ones.';
  }
}
