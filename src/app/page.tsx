'use client';

import { useEffect } from 'react';

import { AIToolsGrid } from '@/components/ai-tools/ai-tools-grid';
import { MainLayout } from '@/components/layout/main-layout';
import { ToolFiltersComponent } from '@/components/ai-tools/tool-filters';
import { useAIToolStore } from '@/lib/store/ai-tools-store';
import { MOCK_AI_TOOLS } from '@/lib/data/mock-tools';

export default function Home() {
  const { setTools, tools, filteredTools } = useAIToolStore();
  
  // Load mock tools on component mount
  useEffect(() => {
    // Only load if we don't have tools already
    if (tools.length === 0) {
      setTools(MOCK_AI_TOOLS);
    }
  }, [setTools, tools.length]);
  
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">AI Navigation Platform</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Discover over 100 innovative AI tools, designed to streamline your workflow and enhance accessibility to cutting-edge artificial intelligence resources.
        </p>
        
        <ToolFiltersComponent />
        
        <AIToolsGrid tools={filteredTools} isLoading={false} />
      </div>
    </MainLayout>
  );
}
