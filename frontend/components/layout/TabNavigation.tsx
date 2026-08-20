'use client';

import { Map as MapIcon, Type, Layout, LayoutGrid, Palette, User, Compass, Box, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
// Future: 3D print / sculpture mode toggle
// import { ModeToggle } from '@/components/controls/ModeToggle';
import { GridLineLogo } from '@/components/ui/GridLineLogo';
import type { ProductMode } from '@/types/sculpture';

export type Tab = 'library' | 'location' | 'style' | 'layers' | 'text' | 'frame' | 'sculpture' | 'account';

// Tabs available for each mode
const posterTabs: Tab[] = ['library', 'location', 'style', 'layers', 'text', 'frame'];
const sculptureTabs: Tab[] = ['library', 'location', 'style', 'sculpture'];

interface TabNavigationProps {
  activeTab: Tab;
  isDrawerOpen: boolean;
  onTabChange: (tab: Tab) => void;
  onToggleDrawer: (open: boolean) => void;
  onOpenExplore?: () => void;
  productMode: ProductMode;
  onModeChange: (mode: ProductMode) => void;
  hasRoute: boolean;
}

export function TabNavigation({
  activeTab,
  isDrawerOpen,
  onTabChange,
  onToggleDrawer,
  onOpenExplore,
  productMode,
  onModeChange: _onModeChange,
  hasRoute: _hasRoute,
}: TabNavigationProps) {
  // Get tabs based on current mode
  const currentTabs = productMode === 'poster' ? posterTabs : sculptureTabs;

  const handleTabClick = (id: Tab) => {
    if (activeTab === id && isDrawerOpen) {
      onToggleDrawer(false);
    } else {
      onTabChange(id);
      onToggleDrawer(true);
    }
  };

  // Future: 3D print / sculpture mode toggle
  // const sculptureDisabled = !hasRoute;
  // const handleModeChange = (mode: ProductMode) => {
  //   onModeChange(mode);
  //   const newTabs = mode === 'poster' ? posterTabs : sculptureTabs;
  //   if (!newTabs.includes(activeTab) && activeTab !== 'account') {
  //     onTabChange(newTabs[1]); // Default to 'location' tab
  //   }
  // };

  const TabButton = ({ id, icon: Icon, label }: { id: Tab, icon: any, label: string }) => (
    <button
      onClick={() => handleTabClick(id)}
      className={cn(
        "flex-1 md:w-full flex flex-col items-center justify-center py-2.5 md:py-5 px-3 space-y-1.5 transition-colors relative",
        activeTab === id && isDrawerOpen
          ? "text-primary bg-primary/10"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
      )}
      title={label}
    >
      <Icon className="w-5 h-5 md:w-6 md:h-6" />
      <span className="text-[11px] font-medium hidden md:block">{label}</span>
      {activeTab === id && isDrawerOpen && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary hidden md:block" />
          <div className="absolute left-0 right-0 top-0 h-1 bg-primary md:hidden" />
        </>
      )}
    </button>
  );

  // Tab configuration with icons
  const tabConfig: Record<Tab, { icon: typeof MapIcon; label: string }> = {
    library: { icon: LayoutGrid, label: 'Gallery' },
    location: { icon: MapIcon, label: 'Location' },
    style: { icon: Palette, label: 'Style' },
    layers: { icon: Layers, label: 'Layers' },
    text: { icon: Type, label: 'Text' },
    frame: { icon: Layout, label: 'Frame' },
    sculpture: { icon: Box, label: 'Sculpture' },
    account: { icon: User, label: 'Account' },
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 md:relative md:h-full md:w-24 bg-card border-t md:border-t-0 md:border-r border-border flex md:flex-col items-center z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:shadow-sm pb-safe md:pb-0">
      <div className="hidden md:flex h-16 items-center justify-center w-full border-b border-border/50 mb-2">
        <Link href="/create" title="GridLine">
          <GridLineLogo size="md" />
        </Link>
      </div>

      {/* Future: 3D print / sculpture mode toggle
      <div className="hidden md:block w-full">
        <ModeToggle
          mode={productMode}
          onModeChange={handleModeChange}
          hasRoute={hasRoute}
        />
      </div>

      <div className="flex md:hidden items-center border-r border-border px-2">
        <div className="flex rounded-lg bg-secondary p-0.5">
          <button
            onClick={() => handleModeChange('poster')}
            className={cn(
              'p-2 rounded-md transition-all',
              productMode === 'poster'
                ? 'bg-card shadow-sm text-adventure-print'
                : 'text-muted-foreground'
            )}
            title="Print Mode"
          >
            <Image className="w-4 h-4" />
          </button>
          <button
            onClick={() => !sculptureDisabled && handleModeChange('sculpture')}
            disabled={sculptureDisabled}
            className={cn(
              'p-2 rounded-md transition-all',
              productMode === 'sculpture'
                ? 'bg-card shadow-sm text-journey-sculpture'
                : sculptureDisabled
                  ? 'text-muted-foreground/30 cursor-not-allowed'
                  : 'text-muted-foreground'
            )}
            title={sculptureDisabled ? 'Add a route first' : '3D Sculpture Mode'}
          >
            <Box className="w-4 h-4" />
          </button>
        </div>
      </div>
      */}

      <div className="flex md:flex-col flex-1 md:flex-none md:w-full md:space-y-1">
        {currentTabs.map((tabId) => {
          const { icon, label } = tabConfig[tabId];
          return <TabButton key={tabId} id={tabId} icon={icon} label={label} />;
        })}
        {/* Account tab on mobile - shows in bottom nav with others */}
        <div className="md:hidden flex-1">
          <TabButton id="account" icon={User} label="Account" />
        </div>
      </div>

      {/* Explore and Account tabs on desktop - shows at bottom of sidenav */}
      <div className="hidden md:flex md:flex-col md:w-full md:space-y-1 md:mt-auto md:mb-2 md:border-t md:border-border md:pt-2">
        {onOpenExplore && (
          <button
            onClick={onOpenExplore}
            className="w-full flex flex-col items-center justify-center py-5 px-3 space-y-1.5 transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary"
            title="Explore Community Maps"
          >
            <Compass className="w-6 h-6" />
            <span className="text-[11px] font-medium">Explore</span>
          </button>
        )}
        <TabButton id="account" icon={User} label="Account" />
      </div>
    </nav>
  );
}

