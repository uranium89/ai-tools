'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, FileText } from 'lucide-react';

import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAIToolStore } from '@/lib/store/ai-tools-store';
import { MOCK_AI_TOOLS } from '@/lib/data/mock-tools';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function CollectionsPage() {
  const { setTools, tools, collections, createCollection } = useAIToolStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  
  // Load mock tools on component mount
  useEffect(() => {
    // Only load if we don't have tools already
    if (tools.length === 0) {
      setTools(MOCK_AI_TOOLS);
    }
  }, [setTools, tools.length]);
  
  const handleCreateCollection = () => {
    if (!name.trim()) {
      toast.error('Please enter a collection name');
      return;
    }
    
    createCollection({
      name: name.trim(),
      description: description.trim(),
      tools: [],
      isPublic,
      createdBy: 'current-user'
    });
    
    toast.success('Collection created successfully');
    setName('');
    setDescription('');
    setIsPublic(true);
    setOpen(false);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Your Collections</h1>
            <p className="text-lg text-muted-foreground">
              Create and manage collections of AI tools for different purposes.
            </p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                New Collection
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Collection</DialogTitle>
                <DialogDescription>
                  Create a new collection to organize AI tools for a specific use case or project.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Collection Name</Label>
                  <Input 
                    id="name" 
                    placeholder="E.g., Content Creation Tools"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe what this collection is for..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    id="public"
                    type="checkbox"
                    checked={isPublic}
                    onChange={e => setIsPublic(e.target.checked)}
                    className="accent-primary h-4 w-4"
                  />
                  <Label htmlFor="public">Make this collection public</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateCollection}>Create Collection</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {collections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No collections yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Create your first collection to organize AI tools for specific use cases or projects.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Your First Collection
                </Button>
              </DialogTrigger>
              <DialogContent>
                {/* Same dialog content as above */}
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map((collection) => (
              <Card key={collection.id} className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span>{collection.name}</span>
                    {collection.isPublic ? (
                      <span className="text-xs bg-muted px-2 py-1 rounded-full">Public</span>
                    ) : (
                      <span className="text-xs bg-muted px-2 py-1 rounded-full">Private</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground text-sm mb-4">
                    {collection.description || "No description provided."}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">{collection.tools.length}</span> tools
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Created {collection.createdAt.toLocaleDateString()}
                  </p>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" className="w-full">View Collection</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
