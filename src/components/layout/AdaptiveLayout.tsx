import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

const MenuTwoBars = ({ size = 20, ...props }: { size?: number } & React.SVGProps<SVGSVGElement>) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="4" y1="17" x2="20" y2="17" />
  </svg>
);

interface AdaptiveLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  onNewChat?: () => void;
}

export const AdaptiveLayout: React.FC<AdaptiveLayoutProps> = ({ children, sidebar, onNewChat }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col border-r border-glass-border glass h-full">
        {sidebar}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-glass-border glass">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <MenuTwoBars size={20} />
          </button>
          {onNewChat && (
            <button
              onClick={onNewChat}
              className="p-2 hover:bg-foreground/10 rounded-lg transition-colors text-accent"
              aria-label="New Chat"
            >
              <Plus size={20} />
            </button>
          )}
        </header>

        <div className="flex-1 flex flex-col min-h-0">
          {children}
        </div>
      </main>

      {/* Mobile Sidebar Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <aside className="absolute left-0 top-0 bottom-0 w-80 flex flex-col glass border-r border-glass-border shadow-2xl zen-fade-in">
            <div className="flex items-center justify-between p-4 border-b border-glass-border">
              <div className="font-medium text-sm tracking-tight">Menu</div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              {sidebar}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
