// Tool Category types
export type ToolCategory = 
  | 'text-generation'
  | 'image-generation'
  | 'code-generation'
  | 'audio-generation'
  | 'video-generation'
  | 'data-analysis'
  | 'language-translation'
  | 'content-research'
  | 'marketing'
  | 'productivity'
  | 'creativity'
  | 'business'
  | 'education'
  | 'development'
  | 'other';

// Access Level types
export type AccessLevel = 'free' | 'freemium' | 'paid' | 'enterprise';

// AI Tool interface
export interface AITool {
  id: string;
  name: string;
  description: string;
  categories: ToolCategory[];
  url: string;
  logoUrl: string;
  accessLevel: AccessLevel;
  pricingUrl?: string;
  features: string[];
  rating?: number;
  reviewCount?: number;
  popularityScore?: number;
  isNew?: boolean;
  isTrending?: boolean;
  tags?: string[];
  apiAvailable?: boolean;
  apiUrl?: string;
}

// Extended AI Tool with user-specific data
export interface UserAITool extends AITool {
  isFavorite: boolean;
  lastUsed?: Date;
  usageCount?: number;
  personalNotes?: string;
}

// Search filters interface
export interface ToolFilters {
  categories?: ToolCategory[];
  accessLevels?: AccessLevel[];
  tags?: string[];
  hasApi?: boolean;
  minRating?: number;
  sortBy?: 'popularity' | 'rating' | 'newest' | 'name';
  sortOrder?: 'asc' | 'desc';
}

// User preferences for AI tools
export interface UserPreferences {
  favoriteTools: string[]; // Tool IDs
  recentTools: string[]; // Tool IDs
  preferredCategories: ToolCategory[];
  theme: 'light' | 'dark' | 'system';
  compactView: boolean;
}
