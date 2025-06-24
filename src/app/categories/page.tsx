'use client';

import { useEffect } from 'react';
import Link from 'next/link';

import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAIToolStore } from '@/lib/store/ai-tools-store';
import { MOCK_AI_TOOLS } from '@/lib/data/mock-tools';
import { TOOL_CATEGORIES } from '@/lib/data/mock-tools';
import { ToolCategory } from '@/types/ai-tools';

export default function CategoriesPage() {
  const { setTools, tools } = useAIToolStore();
  
  // Load mock tools on component mount
  useEffect(() => {
    // Only load if we don't have tools already
    if (tools.length === 0) {
      setTools(MOCK_AI_TOOLS);
    }
  }, [setTools, tools.length]);
  
  // Count tools per category
  const categoryCounts = TOOL_CATEGORIES.reduce<Record<ToolCategory, number>>((acc, category) => {
    acc[category.id] = tools.filter(tool => tool.categories.includes(category.id)).length;
    return acc;
  }, {} as Record<ToolCategory, number>);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Categories</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Browse AI tools by category to find the perfect solution for your needs.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOL_CATEGORIES.map((category) => (
            <Link key={category.id} href={`/categories/${category.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{category.label}</CardTitle>
                  <CardDescription>
                    {categoryCounts[category.id] || 0} tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {getCategoryDescription(category.id)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
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
