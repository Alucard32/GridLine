'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Save, Loader2, Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/ui/tooltip';
import posthog from 'posthog-js';
import type { PosterConfig } from '@/types/poster';
import { encodeConfig } from '@/lib/config/url-state';

// Session storage key for preserving route data during auth
const DRAFT_ROUTE_KEY = 'gridline_draft_route';

interface SaveButtonProps {
  onSave: (name: string) => Promise<void>;
  onUpdate?: () => Promise<void>;
  currentMapId?: string | null;
  currentMapName?: string | null;
  hasUnsavedChanges?: boolean;
  isAuthenticated: boolean;
  disabled?: boolean;
  getCurrentConfig?: () => PosterConfig;
}

export function SaveButton({
  onSave,
  onUpdate,
  currentMapId,
  currentMapName,
  hasUnsavedChanges,
  isAuthenticated,
  disabled,
  getCurrentConfig
}: SaveButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showChoiceDialog, setShowChoiceDialog] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSaveClick = () => {
    if (!isAuthenticated) {
      // Preserve the current design state when redirecting to login
      let redirectUrl = '/create';

      if (getCurrentConfig) {
        const config = getCurrentConfig();

        // Encode the config to URL state (excludes route data due to size)
        const encoded = encodeConfig(config);
        if (encoded) {
          redirectUrl = `/create?s=${encoded}`;
        }

        // Store route data separately in sessionStorage (routes can be very large)
        if (config.route?.data) {
          try {
            sessionStorage.setItem(DRAFT_ROUTE_KEY, JSON.stringify({
              route: config.route,
              timestamp: Date.now()
            }));
          } catch (e) {
            console.warn('[SaveButton] Failed to store route data:', e);
          }
        }
      } else {
        // Fallback: use current URL state if available
        const currentState = searchParams.get('s');
        if (currentState) {
          redirectUrl = `/create?s=${currentState}`;
        }
      }

      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }

    if (currentMapId && currentMapName) {
      // Editing existing map - show choice dialog
      setShowChoiceDialog(true);
    } else {
      // New project - show name dialog
      setProjectName('');
      setError(null);
      setShowDialog(true);
    }
  };

  const handleUpdateExisting = async () => {
    if (!onUpdate || isSaving) return;
    setShowChoiceDialog(false);
    setIsSaving(true);
    setError(null);
    try {
      await onUpdate();
      // Track project update event
      posthog.capture('project_saved', {
        action: 'update_existing',
        project_name: currentMapName,
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err: any) {
      posthog.captureException(err);
      setError(err.message || 'Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAsNew = () => {
    setShowChoiceDialog(false);
    setProjectName(currentMapName ? `${currentMapName} (Copy)` : '');
    setError(null);
    setShowDialog(true);
  };

  const handleSave = async (name: string) => {
    if (!name.trim() || isSaving) return;

    setIsSaving(true);
    setError(null);
    try {
      await onSave(name.trim());
      // Track project creation event
      posthog.capture('project_saved', {
        action: 'create_new',
        project_name: name.trim(),
      });
      setShowDialog(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      setIsSaving(false);
    } catch (err: any) {
      posthog.captureException(err);
      setError(err.message || 'Failed to save project. Please try again.');
      setIsSaving(false);
    }
  };

  const handleDialogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      setError('Please enter a project name');
      return;
    }
    handleSave(projectName);
  };

  if (!isAuthenticated) {
    return (
      <Tooltip content="Sign in to save your work">
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all',
            'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400',
            'hover:bg-gray-200 dark:hover:bg-gray-700',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          onClick={handleSaveClick}
        >
          <Save className="h-4 w-4" />
          <span className="hidden md:inline">Save</span>
        </button>
      </Tooltip>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleSaveClick}
        disabled={isSaving || disabled}
        className={cn(
          'group relative flex items-center gap-2 px-4 py-2 rounded-full font-medium shadow-md transition-all duration-300',
          hasUnsavedChanges
            ? 'bg-primary text-white hover:bg-primary/90 hover:shadow-lg'
            : currentMapName
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750',
          'disabled:opacity-70 disabled:cursor-wait disabled:hover:shadow-md'
        )}
        title={currentMapName ? `Save "${currentMapName}"` : 'Save as new project'}
      >
        <div className={cn(
          "transition-transform duration-300",
          (isSaving || showSuccess) ? "scale-0 w-0" : "scale-100"
        )}>
          <Save className="h-4 w-4" />
        </div>
        
        {isSaving && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}

        {showSuccess && !isSaving && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Check className="h-4 w-4 text-green-600" />
          </div>
        )}

        <span className={cn(
          "transition-all duration-300",
          (isSaving || showSuccess) && "translate-x-4"
        )}>
          {isSaving ? 'Saving...' : showSuccess ? 'Saved!' : currentMapName ? 'Save' : 'Save Project'}
        </span>
        
        {hasUnsavedChanges && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
        )}
      </button>

      {/* Choice Dialog - Update or Save as New */}
      {showChoiceDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowChoiceDialog(false)}
          />
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 z-10">
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Save Changes
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You're editing "{currentMapName}". How would you like to save?
              </p>

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleUpdateExisting}
                  disabled={isSaving}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Save className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Update "{currentMapName}"</div>
                    <div className="text-xs text-white/70">Overwrite the existing project</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleSaveAsNew}
                  disabled={isSaving}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  <Copy className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Save as New Copy</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Create a new project with these changes</div>
                  </div>
                </button>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowChoiceDialog(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setShowDialog(false);
              setError(null);
            }}
          />
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 z-10">
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Save Project
              </h2>
              
              <form onSubmit={handleDialogSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => {
                      setProjectName(e.target.value);
                      setError(null);
                    }}
                    placeholder="My Awesome Map"
                    autoFocus
                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={isSaving}
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDialog(false);
                      setError(null);
                    }}
                    disabled={isSaving}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!projectName.trim() || isSaving}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

