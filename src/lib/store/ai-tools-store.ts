'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  AITool, 
  ToolFilters, 
  UserPreferences 
} from '@/types/ai-tools';

interface AIToolState {
  tools: AITool[];
  filteredTools: AITool[];
  filters: ToolFilters;
  userPreferences: UserPreferences;
  searchTerm: string;
  isLoading: boolean;
  error: string | null;

  // Actions
  setTools: (tools: AITool[]) => void;
  setFilters: (filters: Partial<ToolFilters>) => void;
  setSearchTerm: (term: string) => void;
  addToFavorites: (toolId: string) => void;
  removeFromFavorites: (toolId: string) => void;
  addRecentTool: (toolId: string) => void;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
}

const DEFAULT_USER_PREFERENCES: UserPreferences = {
  favoriteTools: [],
  recentTools: [],
  preferredCategories: [],
  theme: 'system',
  compactView: false,
};

export const useAIToolStore = create<AIToolState>()(
  persist(
    (set, get) => ({
      tools: [],
      filteredTools: [],
      filters: {},
      userPreferences: DEFAULT_USER_PREFERENCES,
      searchTerm: '',
      isLoading: false,
      error: null,

      setTools: (tools) => {
        set({ tools });
        // Apply current filters whenever tools change
        const { filters, searchTerm } = get();
        set({ filteredTools: filterTools(tools, filters, searchTerm) });
      },

      setFilters: (newFilters) => {
        const filters = { ...get().filters, ...newFilters };
        const filteredTools = filterTools(get().tools, filters, get().searchTerm);
        set({ filters, filteredTools });
      },

      setSearchTerm: (searchTerm) => {
        const filteredTools = filterTools(get().tools, get().filters, searchTerm);
        set({ searchTerm, filteredTools });
      },

      addToFavorites: (toolId) => {
        const userPreferences = { ...get().userPreferences };
        if (!userPreferences.favoriteTools.includes(toolId)) {
          userPreferences.favoriteTools = [...userPreferences.favoriteTools, toolId];
          set({ userPreferences });
        }
      },

      removeFromFavorites: (toolId) => {
        const userPreferences = { ...get().userPreferences };
        userPreferences.favoriteTools = userPreferences.favoriteTools.filter(id => id !== toolId);
        set({ userPreferences });
      },

      addRecentTool: (toolId) => {
        const userPreferences = { ...get().userPreferences };
        // Remove if exists to avoid duplicates
        userPreferences.recentTools = userPreferences.recentTools.filter(id => id !== toolId);
        // Add to beginning of array (most recent first)
        userPreferences.recentTools = [toolId, ...userPreferences.recentTools];
        // Limit to 20 recent tools
        if (userPreferences.recentTools.length > 20) {
          userPreferences.recentTools = userPreferences.recentTools.slice(0, 20);
        }
        set({ userPreferences });
      },

      updateUserPreferences: (preferences) => {
        set({ 
          userPreferences: { 
            ...get().userPreferences, 
            ...preferences 
          } 
        });
      },
    }),
    {
      name: 'ai-tools-storage',
      partialize: (state) => ({
        userPreferences: state.userPreferences,
      }),
    }
  )
);

// Helper functions
function filterTools(tools: AITool[], filters: ToolFilters, searchTerm: string): AITool[] {
  let filtered = [...tools];

  // Apply search term filter
  if (searchTerm) {
    const lowerSearch = searchTerm.toLowerCase();
    filtered = filtered.filter(
      tool => 
        tool.name.toLowerCase().includes(lowerSearch) || 
        tool.description.toLowerCase().includes(lowerSearch) ||
        tool.tags?.some(tag => tag.toLowerCase().includes(lowerSearch))
    );
  }

  // Apply category filters
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter(
      tool => tool.categories.some(category => filters.categories?.includes(category))
    );
  }

  // Apply access level filters
  if (filters.accessLevels && filters.accessLevels.length > 0) {
    filtered = filtered.filter(
      tool => filters.accessLevels?.includes(tool.accessLevel)
    );
  }

  // Apply tag filters
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(
      tool => filters.tags?.some(tag => tool.tags?.includes(tag))
    );
  }

  // Apply API filter
  if (filters.hasApi !== undefined) {
    filtered = filtered.filter(tool => tool.apiAvailable === filters.hasApi);
  }

  // Apply rating filter
  if (filters.minRating !== undefined) {
    filtered = filtered.filter(
      tool => (tool.rating || 0) >= (filters.minRating || 0)
    );
  }

  // Apply sorting
  if (filters.sortBy) {
    const sortOrder = filters.sortOrder === 'desc' ? -1 : 1;
    
    switch (filters.sortBy) {
      case 'name':
        filtered.sort((a, b) => sortOrder * a.name.localeCompare(b.name));
        break;
      case 'popularity':
        filtered.sort((a, b) => sortOrder * ((b.popularityScore || 0) - (a.popularityScore || 0)));
        break;
      case 'rating':
        filtered.sort((a, b) => sortOrder * ((b.rating || 0) - (a.rating || 0)));
        break;
      case 'newest':
        filtered.sort((a, b) => sortOrder * (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
        break;
      default:
        break;
    }
  }

  return filtered;
}
