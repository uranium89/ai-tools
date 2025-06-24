'use client';

import { useEffect, useState } from 'react';

import { MainLayout } from '@/components/layout/main-layout';
import { AIToolsGrid } from '@/components/ai-tools/ai-tools-grid';
import { ToolFiltersComponent } from '@/components/ai-tools/tool-filters';
import { useAIToolStore } from '@/lib/store/ai-tools-store';
import { MOCK_AI_TOOLS } from '@/lib/data/mock-tools';
import { Separator } from '@/components/ui/separator';

export default function AllToolsPage() {
  const { setTools, tools, filteredTools } = useAIToolStore();
  const [isLoading, setIsLoading] = useState(true);
  
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

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">All AI Tools</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Browse our comprehensive collection of AI tools to find the perfect solution for your needs.
        </p>
        
        <ToolFiltersComponent />
        
        <AIToolsGrid tools={filteredTools} isLoading={isLoading} />
        
        <Separator className="my-12" />
        
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">Can&apos;t find what you&apos;re looking for?</h2>
          <p className="text-muted-foreground mb-6">
            We&apos;re constantly adding new tools to our platform. If you know of a great AI tool that we should include,
            please let us know.
          </p>
          <p className="text-sm">
            <a href="/contact" className="text-blue-500 hover:underline">
              Suggest a tool →
            </a>
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
