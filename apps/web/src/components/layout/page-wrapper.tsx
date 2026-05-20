import { cn } from '@/lib/utils';

interface PageWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  contained?: boolean;
}

export function PageWrapper({ children, contained = false, className, ...props }: PageWrapperProps) {
  return (
    <main className={cn('min-h-screen', className)} {...props}>
      {contained ? (
        <div className="container mx-auto px-4 py-10 lg:px-6">{children}</div>
      ) : (
        children
      )}
    </main>
  );
}
