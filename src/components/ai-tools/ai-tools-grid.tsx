'use client';

import { Grid, List } from 'lucide-react';

import { AITool } from '@/types/ai-tools';
import { AIToolCard } from '@/components/ai-tools/ai-tool-card';
import { Button } from '@/components/ui/button';
import { useAIToolStore } from '@/lib/store/ai-tools-store';

interface AIToolsGridProps {
  tools: AITool[];
  isLoading?: boolean;
}

export function AIToolsGrid({ tools, isLoading = false }: AIToolsGridProps) {
  const { userPreferences, updateUserPreferences } = useAIToolStore();
  const { compactView } = userPreferences;

  const toggleView = () => {
    updateUserPreferences({ compactView: !compactView });
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="mb-4 flex justify-between">
          <h2 className="text-2xl font-bold">AI Tools</h2>
          <Button variant="outline" size="sm" onClick={toggleView}>
            {compactView ? <Grid className="h-4 w-4 mr-2" /> : <List className="h-4 w-4 mr-2" />}
            {compactView ? 'Grid View' : 'List View'}
          </Button>
        </div>
        <div className={compactView ? 'space-y-2' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}>
          {[...Array(9)].map((_, index) => (
            <div 
              key={index} 
              className={`animate-pulse bg-muted rounded-lg ${compactView ? 'h-16' : 'h-60'}`}
            />
          ))}
        </div>
      </div>
    );
  }

  if (tools.length === 0) {
    return (
      <div className="w-full text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No AI tools found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or search criteria</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">AI Tools ({tools.length})</h2>
        <Button variant="outline" size="sm" onClick={toggleView}>
          {compactView ? <Grid className="h-4 w-4 mr-2" /> : <List className="h-4 w-4 mr-2" />}
          {compactView ? 'Grid View' : 'List View'}
        </Button>
      </div>
      <div className={compactView 
        ? 'space-y-2' 
        : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
      }>
        {tools.map((tool) => (
          <AIToolCard 
            key={tool.id} 
            tool={tool} 
            variant={compactView ? 'compact' : 'default'}
          />
        ))}
      </div>
    </div>
  );
}
