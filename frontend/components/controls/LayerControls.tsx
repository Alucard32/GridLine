'use client';

import { PosterConfig, LayerToggle, ColorPalette } from '@/types/poster';
import { cn } from '@/lib/utils';
import { HexColorPicker } from 'react-colorful';
import { useState, useMemo } from 'react';
import {
  Ban,
  CircleDot,
  Crosshair,
  Flag,
  Heart,
  Home,
  MapPin,
  MapPinPlus,
  Ruler,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import { ControlSection, ControlCheckbox, ControlSlider, ControlLabel, ControlInput, CollapsibleSection } from '@/components/ui/control-components';
import { Tooltip } from '@/components/ui/tooltip';

interface LayerControlsProps {
  layers: PosterConfig['layers'];
  onLayersChange: (layers: Partial<PosterConfig['layers']>) => void;
  availableToggles: LayerToggle[];
  palette: ColorPalette;
  locationCenter: [number, number];
}

const markerTypes = [
  { id: 'none', icon: Ban, label: 'None' },
  { id: 'pin', icon: MapPin, label: 'Pin' },
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'heart', icon: Heart, label: 'Heart' },
  { id: 'dot', icon: CircleDot, label: 'Dot' },
  { id: 'crosshair', icon: Crosshair, label: 'Target' },
  { id: 'star', icon: Star, label: 'Star' },
  { id: 'diamond', icon: Sparkles, label: 'Diamond' },
  { id: 'flag', icon: Flag, label: 'Flag' },
] as const;

const scaleBarPositions = [
  { id: 'bottom-left', label: 'BL', fullLabel: 'Bottom Left' },
  { id: 'bottom-right', label: 'BR', fullLabel: 'Bottom Right' },
  { id: 'top-left', label: 'TL', fullLabel: 'Top Left' },
  { id: 'top-right', label: 'TR', fullLabel: 'Top Right' },
] as const;

export function LayerControls({ layers, onLayersChange, availableToggles, palette, locationCenter }: LayerControlsProps) {
  const [showMarkerColorPicker, setShowMarkerColorPicker] = useState(false);
  const [showScaleBarColorPicker, setShowScaleBarColorPicker] = useState(false);
  
  const effectiveMarkerColor = useMemo(() => {
    return layers.markerColor || palette.primary || palette.accent || palette.text;
  }, [layers.markerColor, palette.primary, palette.accent, palette.text]);

  const effectiveScaleBarColor = useMemo(() => {
    return layers.scaleBarColor || palette.text || '#FFFFFF';
  }, [layers.scaleBarColor, palette.text]);

  const toggleLayer = (key: keyof PosterConfig['layers']) => {
    onLayersChange({ [key]: !layers[key] });
  };

  const isTerrainUnderWaterToggleVisible = availableToggles.some(t => t.id === 'terrainUnderWater');

  const handleLabelSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onLayersChange({ labelSize: parseFloat(e.target.value) });
  };

  const handleLabelMaxWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onLayersChange({ labelMaxWidth: parseFloat(e.target.value) });
  };

  const handleContourDensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    onLayersChange({ contourDensity: value });
  };

  const handleHillshadeExaggerationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onLayersChange({ hillshadeExaggeration: parseFloat(e.target.value) });
  };

  const handleRoadWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onLayersChange({ roadWeight: parseFloat(e.target.value) });
  };

  const placedMarkers = layers.placedMarkers ?? [];

  const handleMarkLocation = () => {
    const [lng, lat] = locationCenter;
    const alreadyPlaced = placedMarkers.some(
      ([mlng, mlat]) => Math.abs(mlng - lng) < 1e-7 && Math.abs(mlat - lat) < 1e-7
    );
    if (alreadyPlaced) return;
    onLayersChange({ placedMarkers: [...placedMarkers, [lng, lat]] });
  };

  const handleRemovePlacedMarker = (index: number) => {
    onLayersChange({
      placedMarkers: placedMarkers.filter((_, i) => i !== index),
    });
  };

  // 3D Buildings camera presets - compact labels for UI
  const cameraPresets = [
    { id: 'isometric', label: 'ISO', fullLabel: 'Isometric', pitch: 45, bearing: 45 },
    { id: 'skyline', label: 'SKY', fullLabel: 'Skyline', pitch: 60, bearing: -15 },
    { id: 'birdseye', label: 'BIRD', fullLabel: "Bird's Eye", pitch: 35, bearing: 0 },
    { id: 'dramatic', label: 'DRAMA', fullLabel: 'Dramatic', pitch: 55, bearing: 30 },
  ] as const;

  // 3D Buildings style presets
  const building3DStyles = [
    { id: 'solid', label: 'Solid', description: 'Classic opaque' },
    { id: 'glass', label: 'Glass', description: 'See-through' },
    { id: 'wireframe', label: 'Wire', description: 'Sketch outline' },
    { id: 'gradient', label: 'Fade', description: 'Height gradient' },
  ] as const;

  // 2D Buildings style presets
  const building2DStyles = [
    { id: 'fill', label: 'Fill', description: 'Classic filled buildings' },
    { id: 'sketch', label: 'Sketch', description: 'Hand-drawn pencil effect' },
    { id: 'outline', label: 'Outline', description: 'Clean outline only' },
  ] as const;

  const applyPreset = (preset: typeof cameraPresets[number]) => {
    onLayersChange({
      buildings3dPitch: preset.pitch,
      buildings3dBearing: preset.bearing,
    });
  };

  // Categorize layers
  const geographicLayers = availableToggles.filter(t => 
    ['terrain', 'water', 'parks', 'buildings', 'terrainUnderWater', 'contours', 'boundaries'].includes(t.id)
  );
  const labelLayers = availableToggles.filter(t => 
    ['labels', 'labels-admin', 'labels-cities'].includes(t.id)
  );
  const dataLayers = availableToggles.filter(t => 
    ['streets', 'population', 'pois'].includes(t.id)
  );

  const renderLayerItem = (item: LayerToggle) => {
    return (
      <div key={item.id} className="space-y-2">
        <ControlCheckbox
          label={item.name}
          checked={Boolean(layers[item.id as keyof PosterConfig['layers']])}
          onChange={() => toggleLayer(item.id as keyof PosterConfig['layers'])}
        />

        {/* Road Weight Control */}
        {item.id === 'streets' && layers.streets && (
          <div className="pl-8 pr-2 pb-2">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-3">
              <div className="space-y-1">
                <ControlLabel className="text-[10px] uppercase text-gray-500">Line Weight</ControlLabel>
                <ControlSlider
                  min="0.1"
                  max="3.0"
                  step="0.1"
                  value={layers.roadWeight ?? 1.0}
                  onChange={handleRoadWeightChange}
                  displayValue={`${(layers.roadWeight ?? 1.0).toFixed(1)}x`}
                  onValueChange={(value) => onLayersChange({ roadWeight: value })}
                  formatValue={(v) => v.toFixed(1)}
                  parseValue={(s) => parseFloat(s.replace('x', ''))}
                />
                <div className="flex justify-between text-[10px] text-gray-400 uppercase font-medium">
                  <span>Fine</span>
                  <span>Bold</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Label Size Control */}
        {item.id === 'labels' && layers.labels && (
          <div className="pl-8 pr-2 pb-2">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-4">
              <div className="space-y-2">
                <ControlLabel className="text-[10px] uppercase text-gray-500">Label Style</ControlLabel>
                <div className="grid grid-cols-2 gap-2">
                  {['standard', 'elevated', 'glass', 'vintage'].map((style) => (
                    <button
                      key={style}
                      onClick={() => onLayersChange({ labelStyle: style as any })}
                      className={cn(
                        "py-1.5 px-2 text-[10px] uppercase font-bold rounded border transition-all",
                        (layers.labelStyle || 'elevated') === style
                          ? "bg-primary border-primary text-white shadow-sm"
                          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600"
                      )}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <ControlLabel className="text-[10px] uppercase text-gray-500">Label Size</ControlLabel>
                <ControlSlider
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={layers.labelSize ?? 1.0}
                  onChange={handleLabelSizeChange}
                  displayValue={`${(layers.labelSize ?? 1.0).toFixed(1)}x`}
                  onValueChange={(value) => onLayersChange({ labelSize: value })}
                  formatValue={(v) => v.toFixed(1)}
                  parseValue={(s) => parseFloat(s.replace('x', ''))}
                />
              </div>

              <div className="space-y-1">
                <ControlLabel className="text-[10px] uppercase text-gray-500">Label Wrap</ControlLabel>
                <ControlSlider
                  min="2"
                  max="20"
                  step="1"
                  value={layers.labelMaxWidth ?? 10}
                  onChange={handleLabelMaxWidthChange}
                  displayValue={layers.labelMaxWidth ?? 10}
                  onValueChange={(value) => onLayersChange({ labelMaxWidth: value })}
                  formatValue={(v) => String(Math.round(v))}
                  parseValue={(s) => parseInt(s)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Hillshade Exaggeration Control */}
        {item.id === 'terrain' && layers.terrain && (
          <div className="pl-8 pr-2 pb-2">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-3">
              <div className="space-y-1">
                <ControlLabel className="text-[10px] uppercase text-gray-500">Shading Intensity</ControlLabel>
                <ControlSlider
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={layers.hillshadeExaggeration ?? 0.5}
                  onChange={handleHillshadeExaggerationChange}
                  displayValue={`${(layers.hillshadeExaggeration ?? 0.5).toFixed(2)}x`}
                  onValueChange={(value) => onLayersChange({ hillshadeExaggeration: value })}
                  formatValue={(v) => v.toFixed(2)}
                  parseValue={(s) => parseFloat(s.replace('x', ''))}
                />
                <div className="flex justify-between text-[10px] text-gray-400 uppercase font-medium">
                  <Tooltip content="No shading (0.0x)">
                    <span>Subtle</span>
                  </Tooltip>
                  <Tooltip content="Maximum shading (1.0x)">
                    <span>Strong</span>
                  </Tooltip>
                </div>
              </div>
              
              {isTerrainUnderWaterToggleVisible && (
                <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                  <ControlCheckbox
                    label="Show under water"
                    checked={Boolean(layers.terrainUnderWater)}
                    onChange={() => toggleLayer('terrainUnderWater')}
                    className="text-[10px] font-medium"
                  />
                </div>
              )}

              {/* 3D Terrain Elevation */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                <ControlCheckbox
                  label="3D Elevation"
                  checked={Boolean(layers.terrain3d)}
                  onChange={() => toggleLayer('terrain3d')}
                  className="text-[10px] font-medium"
                />

                {layers.terrain3d && (
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[9px] text-gray-400">Height Exaggeration</span>
                      <span className="text-[9px] text-gray-500 font-medium">{(layers.terrain3dExaggeration ?? 1.0).toFixed(1)}x</span>
                    </div>
                    <ControlSlider
                      min="0.5"
                      max="3.0"
                      step="0.1"
                      value={layers.terrain3dExaggeration ?? 1.0}
                      onChange={(e) => onLayersChange({ terrain3dExaggeration: parseFloat(e.target.value) })}
                      displayValue={`${(layers.terrain3dExaggeration ?? 1.0).toFixed(1)}x`}
                      onValueChange={(value) => onLayersChange({ terrain3dExaggeration: value })}
                      formatValue={(v) => `${v.toFixed(1)}x`}
                      parseValue={(s) => parseFloat(s.replace('x', ''))}
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 uppercase font-medium">
                      <span>Subtle</span>
                      <span>Dramatic</span>
                    </div>
                    <p className="text-[8px] text-gray-400 italic pt-1">Tilt the map for best 3D effect</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3D Extrusion Control - only when buildings are enabled */}
        {item.id === 'buildings' && layers.buildings && (
          <div className="pl-8 pr-2 pb-2">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-3">
              {/* 2D Building Style Selector - only when 3D is disabled */}
              {!layers.buildings3d && (
                <div className="space-y-2">
                  <ControlLabel className="text-[10px] uppercase text-gray-500">Style</ControlLabel>
                  <div className="grid grid-cols-3 gap-1">
                    {building2DStyles.map((style) => {
                      const isActive = (layers.buildingsStyle ?? 'fill') === style.id;
                      return (
                        <Tooltip key={style.id} content={style.description}>
                          <button
                            onClick={() => onLayersChange({ buildingsStyle: style.id as any })}
                            className={cn(
                              "py-1.5 px-1 text-[9px] uppercase font-bold rounded border transition-all",
                              isActive
                                ? "bg-primary border-primary text-white shadow-sm"
                                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600"
                            )}
                          >
                            {style.label}
                          </button>
                        </Tooltip>
                      );
                    })}
                  </div>
                  <p className="text-[8px] text-gray-400 italic">Sketch style works best with paper texture</p>
                </div>
              )}

              <ControlCheckbox
                label="3D Extrusion"
                checked={Boolean(layers.buildings3d)}
                onChange={() => toggleLayer('buildings3d')}
                className="text-[10px] font-medium"
              />

              {layers.buildings3d && (
                <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                  {/* Building Style Presets */}
                  <div className="space-y-2">
                    <ControlLabel className="text-[10px] uppercase text-gray-500">Style</ControlLabel>
                    <div className="grid grid-cols-4 gap-1">
                      {building3DStyles.map((style) => {
                        const isActive = (layers.buildings3dStyle ?? 'solid') === style.id;
                        return (
                          <Tooltip key={style.id} content={style.description}>
                            <button
                              onClick={() => onLayersChange({ buildings3dStyle: style.id as any })}
                              className={cn(
                                "py-1.5 px-1 text-[9px] uppercase font-bold rounded border transition-all",
                                isActive
                                  ? "bg-primary border-primary text-white shadow-sm"
                                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600"
                              )}
                            >
                              {style.label}
                            </button>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </div>

                  {/* Opacity Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[9px] text-gray-400">Opacity</span>
                      <span className="text-[9px] text-gray-500 font-medium">{Math.round((layers.buildings3dOpacity ?? 1) * 100)}%</span>
                    </div>
                    <ControlSlider
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={layers.buildings3dOpacity ?? 1}
                      onChange={(e) => onLayersChange({ buildings3dOpacity: parseFloat(e.target.value) })}
                      displayValue={`${Math.round((layers.buildings3dOpacity ?? 1) * 100)}%`}
                      onValueChange={(value) => onLayersChange({ buildings3dOpacity: value })}
                      formatValue={(v) => `${Math.round(v * 100)}%`}
                      parseValue={(s) => parseInt(s.replace('%', '')) / 100}
                    />
                  </div>

                  {/* Height Scale */}
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[9px] text-gray-400">Height Scale</span>
                      <span className="text-[9px] text-gray-500 font-medium">{(layers.buildings3dHeightScale ?? 1).toFixed(1)}x</span>
                    </div>
                    <ControlSlider
                      min="0.5"
                      max="3"
                      step="0.1"
                      value={layers.buildings3dHeightScale ?? 1}
                      onChange={(e) => onLayersChange({ buildings3dHeightScale: parseFloat(e.target.value) })}
                      displayValue={`${(layers.buildings3dHeightScale ?? 1).toFixed(1)}x`}
                      onValueChange={(value) => onLayersChange({ buildings3dHeightScale: value })}
                      formatValue={(v) => `${v.toFixed(1)}x`}
                      parseValue={(s) => parseFloat(s.replace('x', ''))}
                    />
                  </div>

                  {/* Default Height */}
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[9px] text-gray-400">Default Height</span>
                      <span className="text-[9px] text-gray-500 font-medium">{layers.buildings3dDefaultHeight ?? 6}m</span>
                    </div>
                    <ControlSlider
                      min="0"
                      max="30"
                      step="1"
                      value={layers.buildings3dDefaultHeight ?? 6}
                      onChange={(e) => onLayersChange({ buildings3dDefaultHeight: parseFloat(e.target.value) })}
                      displayValue={`${layers.buildings3dDefaultHeight ?? 6}m`}
                      onValueChange={(value) => onLayersChange({ buildings3dDefaultHeight: value })}
                      formatValue={(v) => `${Math.round(v)}m`}
                      parseValue={(s) => parseInt(s.replace('m', ''))}
                    />
                    <p className="text-[8px] text-gray-400 italic">For buildings without height data</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contour Density Control */}
        {item.id === 'contours' && layers.contours && (
          <div className="pl-8 pr-2 pb-2">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-3">
              <div className="space-y-1">
                <ControlLabel className="text-[10px] uppercase text-gray-500">Line Interval</ControlLabel>
                <ControlSlider
                  min="10"
                  max="250"
                  step="10"
                  value={layers.contourDensity ?? 50}
                  onChange={handleContourDensityChange}
                  displayValue={`${layers.contourDensity ?? 50}m`}
                  onValueChange={(value) => onLayersChange({ contourDensity: Math.round(value) })}
                  formatValue={(v) => `${Math.round(v)}m`}
                  parseValue={(s) => parseInt(s.replace('m', ''))}
                />
                <div className="flex justify-between text-[10px] text-gray-400 uppercase font-medium">
                  <span>Dense</span>
                  <span>Sparse</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <ControlSection title="Visible Layers">
        {/* Location Marker - First */}
        <div className="space-y-4 pb-4 border-b border-gray-100 dark:border-gray-800">
          <ControlCheckbox
            label="Location Marker"
            checked={Boolean(layers.marker)}
            onChange={() => toggleLayer('marker')}
          />

          {layers.marker && (
            <div className="pl-8 pr-2 pb-2">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-4">
                {/* Marker Type Selector */}
                <div className="space-y-2">
                  <ControlLabel className="text-[10px] uppercase text-gray-500">Icon Style</ControlLabel>
                  <div className="grid grid-cols-3 gap-2">
                    {markerTypes.map(({ id, icon: Icon, label }) => {
                      const isActive = (layers.markerType ?? 'none') === id;
                      return (
                        <button
                          key={id}
                          onClick={() => onLayersChange({ markerType: id })}
                          className={cn(
                            "flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-lg border transition-all",
                            isActive
                              ? "bg-white dark:bg-gray-700 border-primary text-primary dark:text-primary shadow-sm ring-1 ring-primary/20"
                              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-[10px] uppercase tracking-tight font-medium">{label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={handleMarkLocation}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-primary dark:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 border border-primary/30 dark:border-primary/40 transition-colors"
                  >
                    <MapPinPlus className="h-3.5 w-3.5" />
                    Mark location
                  </button>
                  <p className="text-[8px] text-gray-400 italic">
                    Places the icon at the current map center
                  </p>
                  {placedMarkers.length > 0 && (
                    <div className="space-y-1.5">
                      {placedMarkers.map((coords, index) => (
                        <div
                          key={`${coords[0]}-${coords[1]}-${index}`}
                          className="flex items-center justify-between gap-2 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-1.5"
                        >
                          <span className="text-[10px] text-gray-600 dark:text-gray-300 font-medium truncate">
                            Marker {index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemovePlacedMarker(index)}
                            className="p-0.5 text-gray-400 hover:text-red-500 transition-colors"
                            aria-label={`Remove marker ${index + 1}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Icon Scale */}
                <div className="space-y-1">
                  <ControlLabel className="text-[10px] uppercase text-gray-500">Icon Size</ControlLabel>
                  <ControlSlider
                    min="0.5"
                    max="1.5"
                    step="0.05"
                    value={layers.markerScale ?? 1}
                    onChange={(e) => onLayersChange({ markerScale: parseFloat(e.target.value) })}
                    displayValue={`${Math.round((layers.markerScale ?? 1) * 100)}%`}
                    onValueChange={(value) => onLayersChange({ markerScale: value })}
                    formatValue={(v) => `${Math.round(v * 100)}%`}
                    parseValue={(s) => parseInt(s.replace('%', '')) / 100}
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 uppercase font-medium">
                    <span>50%</span>
                    <span>150%</span>
                  </div>
                </div>

                {/* Marker Color Control */}
                <div className="space-y-2 relative">
                  <ControlLabel 
                    className="text-[10px] uppercase text-gray-500"
                    action={
                      <button
                        onClick={() => onLayersChange({ markerColor: undefined })}
                        className="text-[10px] text-primary hover:underline font-medium"
                      >
                        Reset
                      </button>
                    }
                  >
                    Icon Color
                  </ControlLabel>
                  
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowMarkerColorPicker(!showMarkerColorPicker)}
                      className={cn(
                        'w-9 h-9 rounded-md border shadow-sm transition-all',
                        showMarkerColorPicker
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      )}
                      style={{ backgroundColor: effectiveMarkerColor }}
                      aria-label="Toggle marker color picker"
                    />
                    <ControlInput
                      type="text"
                      value={effectiveMarkerColor}
                      onChange={(e) => onLayersChange({ markerColor: e.target.value })}
                      className="font-mono"
                      placeholder={palette.primary || palette.accent || palette.text}
                    />
                  </div>
                  
                  {showMarkerColorPicker && (
                    <div className="absolute left-0 top-full mt-2 z-50 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl animate-in fade-in zoom-in-95 duration-200">
                      <div 
                        className="fixed inset-0 z-[-1]" 
                        onClick={() => setShowMarkerColorPicker(false)} 
                      />
                      <HexColorPicker
                        color={effectiveMarkerColor}
                        onChange={(color) => onLayersChange({ markerColor: color })}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scale Bar */}
        <div className="space-y-4 pb-4 border-b border-gray-100 dark:border-gray-800">
          <ControlCheckbox
            label="Scale Bar"
            checked={Boolean(layers.showScaleBar)}
            onChange={() => toggleLayer('showScaleBar')}
          />

          {layers.showScaleBar && (
            <div className="pl-8 pr-2 pb-2">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-4">
                <div className="space-y-2">
                  <ControlLabel className="text-[10px] uppercase text-gray-500">Position</ControlLabel>
                  <div className="grid grid-cols-4 gap-1">
                    {scaleBarPositions.map((pos) => {
                      const isActive = (layers.scaleBarPosition ?? 'bottom-left') === pos.id;
                      return (
                        <Tooltip key={pos.id} content={pos.fullLabel}>
                          <button
                            onClick={() => onLayersChange({ scaleBarPosition: pos.id as any })}
                            className={cn(
                              "py-1.5 px-1 text-[9px] uppercase font-bold rounded border transition-all",
                              isActive
                                ? "bg-primary border-primary text-white shadow-sm"
                                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600"
                            )}
                          >
                            {pos.label}
                          </button>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>

                {/* Scale Bar Color */}
                <div className="space-y-2 relative">
                  <ControlLabel
                    className="text-[10px] uppercase text-gray-500"
                    action={
                      <button
                        onClick={() => onLayersChange({ scaleBarColor: undefined })}
                        className="text-[10px] text-primary hover:underline font-medium"
                      >
                        Reset
                      </button>
                    }
                  >
                    Color
                  </ControlLabel>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowScaleBarColorPicker(!showScaleBarColorPicker)}
                      className={cn(
                        'w-9 h-9 rounded-md border shadow-sm transition-all',
                        showScaleBarColorPicker
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      )}
                      style={{ backgroundColor: effectiveScaleBarColor }}
                      aria-label="Toggle scale bar color picker"
                    />
                    <ControlInput
                      type="text"
                      value={effectiveScaleBarColor}
                      onChange={(e) => onLayersChange({ scaleBarColor: e.target.value })}
                      className="font-mono"
                      placeholder={palette.text || '#FFFFFF'}
                    />
                  </div>

                  {showScaleBarColorPicker && (
                    <div className="absolute left-0 top-full mt-2 z-50 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl animate-in fade-in zoom-in-95 duration-200">
                      <div
                        className="fixed inset-0 z-[-1]"
                        onClick={() => setShowScaleBarColorPicker(false)}
                      />
                      <HexColorPicker
                        color={effectiveScaleBarColor}
                        onChange={(color) => onLayersChange({ scaleBarColor: color })}
                      />
                    </div>
                  )}
                </div>

                <p className="text-[8px] text-gray-400 italic">Shows distance scale on the map - useful for routes</p>
              </div>
            </div>
          )}
        </div>

        {/* Perspective / Camera Controls - independent of 3D buildings */}
        <CollapsibleSection title="Perspective" defaultOpen={false}>
          <div className="space-y-4">
            {/* Camera Presets */}
            <div className="space-y-2">
              <ControlLabel className="text-[10px] uppercase text-gray-500">Camera Angle</ControlLabel>
              <div className="grid grid-cols-4 gap-1">
                {cameraPresets.map((preset) => {
                  const isActive =
                    (layers.buildings3dPitch ?? 0) === preset.pitch &&
                    (layers.buildings3dBearing ?? 0) === preset.bearing;
                  return (
                    <Tooltip key={preset.id} content={preset.fullLabel}>
                      <button
                        onClick={() => applyPreset(preset)}
                        className={cn(
                          "py-1.5 px-1 text-[9px] uppercase font-bold rounded border transition-all",
                          isActive
                            ? "bg-primary border-primary text-white shadow-sm"
                            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600"
                        )}
                      >
                        {preset.label}
                      </button>
                    </Tooltip>
                  );
                })}
              </div>
            </div>

            {/* Camera Pitch */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-[9px] text-gray-400">Tilt</span>
                <span className="text-[9px] text-gray-500 font-medium">{layers.buildings3dPitch ?? 0}°</span>
              </div>
              <ControlSlider
                min="0"
                max="60"
                step="5"
                value={layers.buildings3dPitch ?? 0}
                onChange={(e) => onLayersChange({ buildings3dPitch: parseFloat(e.target.value) })}
                displayValue={`${layers.buildings3dPitch ?? 0}°`}
                onValueChange={(value) => onLayersChange({ buildings3dPitch: value })}
                formatValue={(v) => `${Math.round(v)}°`}
                parseValue={(s) => parseInt(s.replace('°', ''))}
              />
            </div>

            {/* Camera Bearing */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-[9px] text-gray-400">Rotation</span>
                <span className="text-[9px] text-gray-500 font-medium">{layers.buildings3dBearing ?? 0}°</span>
              </div>
              <ControlSlider
                min="0"
                max="360"
                step="15"
                value={layers.buildings3dBearing ?? 0}
                onChange={(e) => onLayersChange({ buildings3dBearing: parseFloat(e.target.value) })}
                displayValue={`${layers.buildings3dBearing ?? 0}°`}
                onValueChange={(value) => onLayersChange({ buildings3dBearing: value })}
                formatValue={(v) => `${Math.round(v)}°`}
                parseValue={(s) => parseInt(s.replace('°', ''))}
              />
            </div>

            <p className="text-[8px] text-gray-400 italic">Tilted views work best with 3D buildings enabled</p>
          </div>
        </CollapsibleSection>

        {/* Geographic Features */}
        {geographicLayers.length > 0 && (
          <CollapsibleSection title="Geographic Features" defaultOpen={true}>
            <div className="space-y-2">
              {geographicLayers.map(renderLayerItem)}
            </div>
          </CollapsibleSection>
        )}

        {/* Labels */}
        {labelLayers.length > 0 && (
          <CollapsibleSection title="Labels" defaultOpen={true}>
            <div className="space-y-2">
              {labelLayers.map(renderLayerItem)}
            </div>
          </CollapsibleSection>
        )}

        {/* Data Layers */}
        {dataLayers.length > 0 && (
          <CollapsibleSection title="Data Layers" defaultOpen={true}>
            <div className="space-y-2">
              {dataLayers.map(renderLayerItem)}
            </div>
          </CollapsibleSection>
        )}
      </ControlSection>
    </div>
  );
}
