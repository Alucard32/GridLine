'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { GridLineLogo } from '@/components/ui/GridLineLogo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/control-components';
import { cn } from '@/lib/utils';
import {
  PenTool,
  ArrowLeft,
  ChevronRight,
  User as UserIcon,
  LogOut,
  Map,
  Compass,
  Menu,
  X,
} from 'lucide-react';

export type HeaderVariant = 'editor' | 'feed' | 'detail' | 'profile';

interface UnifiedHeaderProps {
  variant?: HeaderVariant;
  mapTitle?: string;
  showBackToFeed?: boolean;
  className?: string;
}

interface UserMenuProps {
  user: User | null;
  loading: boolean;
  onSignOut: () => void;
}

function UserMenu({ user, loading, onSignOut }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
    );
  }

  if (!user) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push('/login')}
      >
        Sign In
      </Button>
    );
  }

  // Get initials from email or use default
  const initials = user.email
    ? user.email.substring(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-full',
          'bg-primary text-primary-foreground font-medium text-sm',
          'hover:bg-primary/90 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary/50'
        )}
        aria-label="User menu"
      >
        {initials}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-48 py-1 bg-card border border-border rounded-lg shadow-lg z-50">
            <div className="px-3 py-2 border-b border-border">
              <p className="text-sm font-medium text-foreground truncate">
                {user.email}
              </p>
            </div>
            <Link
              href="/profile"
              className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Map className="w-4 h-4" />
              My Adventures
            </Link>
            <Link
              href="/feed"
              className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Compass className="w-4 h-4" />
              Explore Community
            </Link>
            <button
              onClick={() => {
                setIsOpen(false);
                onSignOut();
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

interface BreadcrumbProps {
  variant: HeaderVariant;
  mapTitle?: string;
}

function Breadcrumb({ variant, mapTitle }: BreadcrumbProps) {
  if (variant === 'editor') {
    return null;
  }

  if (variant === 'detail' && mapTitle) {
    return (
      <nav className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link
          href="/feed"
          className="hover:text-foreground transition-colors"
        >
          Community
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium truncate max-w-[120px] sm:max-w-[200px]">
          {mapTitle}
        </span>
      </nav>
    );
  }

  if (variant === 'profile') {
    return (
      <nav className="flex items-center gap-1 text-sm">
        <span className="text-foreground font-medium">My Adventures</span>
      </nav>
    );
  }

  if (variant === 'feed') {
    return (
      <nav className="flex items-center gap-1 text-sm">
        <span className="text-foreground font-medium">Explore Community</span>
      </nav>
    );
  }

  return null;
}

export function UnifiedHeader({
  variant = 'feed',
  mapTitle,
  showBackToFeed = false,
  className,
}: UnifiedHeaderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  // Determine back navigation
  const getBackLink = () => {
    if (variant === 'detail') {
      return { href: '/feed', label: 'Community' };
    }
    if (variant === 'profile' || variant === 'feed') {
      return { href: '/create', label: 'Editor' };
    }
    return null;
  };

  const backLink = getBackLink();

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo + Back/Breadcrumb */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* Logo */}
            <Link href="/create" className="flex-shrink-0">
              <GridLineLogo size="md" showText className="hidden sm:flex" />
              <GridLineLogo size="md" className="sm:hidden" />
            </Link>

            {/* Breadcrumb (desktop) */}
            <div className="hidden lg:block">
              <Breadcrumb variant={variant} mapTitle={mapTitle} />
            </div>
          </div>

          {/* Center Section - Back link on mobile */}
          {backLink && variant === 'detail' && (
            <div className="lg:hidden flex-1 flex justify-center">
              <Link
                href={backLink.href}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
            </div>
          )}

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle variant="compact" className="hidden sm:flex" />

            {/* Create CTA - shown on social pages */}
            {variant !== 'editor' && (
              <Link href="/create">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-accent hover:bg-accent/90 text-white"
                >
                  <PenTool className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Start Journey</span>
                </Button>
              </Link>
            )}

            {/* User Menu */}
            <UserMenu
              user={user}
              loading={loading}
              onSignOut={handleSignOut}
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="px-4 py-3 space-y-1">
            <Link
              href="/create"
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                pathname === '/create'
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground hover:bg-secondary'
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <PenTool className="w-4 h-4" />
              Create Adventure
            </Link>
            <Link
              href="/feed"
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                pathname === '/feed'
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground hover:bg-secondary'
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Compass className="w-4 h-4" />
              Explore Community
            </Link>
            {user && (
              <Link
                href="/profile"
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                  pathname === '/profile'
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-secondary'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Map className="w-4 h-4" />
                My Adventures
              </Link>
            )}
            <div className="pt-2 border-t border-border mt-2">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm text-muted-foreground">Theme</span>
                <ThemeToggle variant="compact" />
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
