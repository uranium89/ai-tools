'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  Menu, 
  Sun, 
  Moon, 
  Grid,
  List,
  BookMarked,
  Clock
} from 'lucide-react';
import { useTheme } from 'next-themes';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAIToolStore } from '@/lib/store/ai-tools-store';
import { TOOL_CATEGORIES } from '@/lib/data/mock-tools';

const MainNav = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();

  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)} {...props}>
      <Link
        href="/"
        className={cn(
          'text-sm font-medium transition-colors hover:text-primary',
          pathname === '/' ? 'text-primary' : 'text-muted-foreground'
        )}
      >
        Dashboard
      </Link>
      <Link
        href="/all-tools"
        className={cn(
          'text-sm font-medium transition-colors hover:text-primary',
          pathname === '/all-tools' ? 'text-primary' : 'text-muted-foreground'
        )}
      >
        All Tools
      </Link>
      <Link
        href="/categories"
        className={cn(
          'text-sm font-medium transition-colors hover:text-primary',
          pathname === '/categories' ? 'text-primary' : 'text-muted-foreground'
        )}
      >
        Categories
      </Link>
    </nav>
  );
};

const MobileNav = () => {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>AI Navigation Platform</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 py-4">
          <SheetClose asChild>
            <Link
              href="/"
              className={cn(
                'flex items-center px-2 py-1 text-lg font-medium rounded-md',
                pathname === '/' ? 'bg-muted' : 'hover:bg-muted'
              )}
            >
              Dashboard
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="/all-tools"
              className={cn(
                'flex items-center px-2 py-1 text-lg font-medium rounded-md',
                pathname === '/all-tools' ? 'bg-muted' : 'hover:bg-muted'
              )}
            >
              All Tools
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="/categories"
              className={cn(
                'flex items-center px-2 py-1 text-lg font-medium rounded-md',
                pathname === '/categories' ? 'bg-muted' : 'hover:bg-muted'
              )}
            >
              Categories
            </Link>
          </SheetClose>
        </div>
        <div className="py-4">
          <h3 className="mb-2 text-lg font-semibold">Categories</h3>
          <div className="space-y-1">
            {TOOL_CATEGORIES.map((category) => (
              <SheetClose key={category.id} asChild>
                <Link
                  href={`/categories/${category.id}`}
                  className="flex items-center px-2 py-1 text-sm rounded-md hover:bg-muted"
                >
                  {category.label}
                </Link>
              </SheetClose>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const SearchBar = () => {
  const { searchTerm, setSearchTerm } = useAIToolStore();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative w-full max-w-sm lg:max-w-md">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search AI tools..."
        className="pl-8 h-9 md:w-[300px] lg:w-[400px]"
        value={searchTerm}
        onChange={handleChange}
      />
    </div>
  );
};

const ViewToggle = () => {
  const { userPreferences, updateUserPreferences } = useAIToolStore();
  const { compactView } = userPreferences;

  const toggleView = () => {
    updateUserPreferences({ compactView: !compactView });
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleView}>
      {compactView ? (
        <List className="h-4 w-4" />
      ) : (
        <Grid className="h-4 w-4" />
      )}
      <span className="sr-only">
        {compactView ? 'Grid view' : 'List view'}
      </span>
    </Button>
  );
};

const ThemeToggle = () => {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Header = () => {
  return (
    <header className="sticky top-0 z-40 bg-background border-b">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-6">
          <MobileNav />
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">AI Navigation</span>
          </Link>
          <MainNav className="hidden md:flex" />
        </div>
        <div className="flex items-center gap-2">
          <SearchBar />
          <ViewToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

const Sidebar = () => {
  const { userPreferences } = useAIToolStore();
  const { favoriteTools, recentTools } = userPreferences;
  
  return (
    <div className="hidden md:flex w-[240px] shrink-0 flex-col border-r h-[calc(100vh-64px)]">
      <div className="flex flex-col p-4 gap-4">
        <div className="space-y-2">
          <h3 className="flex items-center gap-1.5 text-sm font-medium">
            <BookMarked className="h-4 w-4" />
            Favorites
          </h3>
          {favoriteTools.length === 0 ? (
            <p className="text-xs text-muted-foreground">No favorites yet</p>
          ) : (
            <div className="flex flex-col gap-1">
              {/* Favorite tools would be rendered here */}
              <p className="text-xs text-muted-foreground">You have {favoriteTools.length} favorite tools</p>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="flex items-center gap-1.5 text-sm font-medium">
            <Clock className="h-4 w-4" />
            Recently Viewed
          </h3>
          {recentTools.length === 0 ? (
            <p className="text-xs text-muted-foreground">No recent tools</p>
          ) : (
            <div className="flex flex-col gap-1">
              {/* Recent tools would be rendered here */}
              <p className="text-xs text-muted-foreground">You have {recentTools.length} recent tools</p>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="flex items-center gap-1.5 text-sm font-medium">
            Categories
          </h3>
          <div className="flex flex-col gap-1">
            {TOOL_CATEGORIES.map((category) => (
              <Link 
                key={category.id}
                href={`/categories/${category.id}`} 
                className="text-xs hover:underline"
              >
                {category.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="border-t py-6">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-6">
        <div className="text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            © 2025 AI Navigation Platform. All rights reserved.
          </p>
        </div>
        <nav className="flex items-center gap-4">
          <Link
            href="/about"
            className="text-sm text-muted-foreground hover:underline"
          >
            About
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground hover:underline"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-muted-foreground hover:underline"
          >
            Terms
          </Link>
          <Link
            href="/contact"
            className="text-sm text-muted-foreground hover:underline"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export function MainLayout({ children, showSidebar = true }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        {showSidebar && <Sidebar />}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
