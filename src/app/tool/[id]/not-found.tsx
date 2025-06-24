'use client';

import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <MainLayout showSidebar={false}>
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h1 className="text-4xl font-bold mb-4">Tool Not Found</h1>
        <p className="text-xl text-muted-foreground mb-8">
          The AI tool you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/">Return to home</Link>
        </Button>
      </div>
    </MainLayout>
  );
}
