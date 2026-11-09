"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Level, earthWorlds, getEarthLevels } from "@/lib/kids/levels";
import { getProgress, isLevelUnlocked, type KidsProgress } from "@/lib/kids/progress";
import { analyticsKids } from "@/lib/analytics";
import { JourneyTip } from "./journey-tip";
import { buildLessonUrl } from "@/lib/kids/lesson-origin";
import { 
  PixelTree, 
  PixelBush, 
  PixelCastle, 
  PixelMountain, 
  PixelFlower, 
  PixelStar,
  PixelLevelNode,
  PixelPlaneWithBanner,
  PixelLake,
  PixelPond,
  PixelCar,
  PixelOldCar,
  PixelVan,
  PixelRocket
} from "./pixel-art";

export function ProgressMap() {
  const t = useTranslations("kids");
  const [progress, setProgress] = useState<KidsProgress | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  // Earth map strictly contains Worlds 1-5 foundational prompting levels (19 levels)
  const earthLevels = getEarthLevels();

  useEffect(() => {
    setProgress(getProgress());
    analyticsKids.viewMap();
  }, []);

  // Calculate positions for all Earth levels in a continuous horizontal path
  const levelPositions = earthLevels.map((_, index) => {
    const spacing = 200; // pixels between levels
    const x = 120 + index * spacing;
    // Create a gentle wave pattern - centered around 55%
    const y = 55 + Math.sin(index * 0.8) * 15;
    return { x, y };
  });

  // Calculate map width - ensure it fits content but also works on large screens
  const calculatedWidth = (earthLevels.length * 200) + 240;
  const mapWidth = Math.max(calculatedWidth, 800);

  const scrollLeft = () => {
    if (typeof scrollRef.current?.scrollBy === "function") {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (typeof scrollRef.current?.scrollBy === "function") {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      scrollLeft();
    } else if (e.key === "ArrowRight") {
      scrollRight();
    }
  };

  return (
    <div className="relative h-full flex flex-col">
      {/* Space portal floating banner per FLOW-02 & D-05 */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex flex-col items-center gap-2">
        <Link
          href="/planets"
          className="pixel-btn pixel-btn-blue inline-flex items-center gap-2.5 px-4 py-2 min-h-[44px] text-sm sm:text-base shadow-xl hover:scale-105 transition-transform"
          title={t("map.toPlanetsSub")}
        >
          <PixelRocket className="w-5 h-7 shrink-0" />
          <div className="text-left leading-tight">
            <span className="block font-bold text-white text-xs sm:text-sm tracking-wide">
              {t("map.toPlanetsBanner")}
            </span>
            <span className="block text-[10px] sm:text-xs text-sky-200 opacity-90 hidden sm:block">
              {t("map.toPlanetsSub")}
            </span>
          </div>
        </Link>

        {/* First-visit guidance tip (D-12, UI-SPEC): Unobstructed inline position, independent dismissal */}
        <JourneyTip
          screenId="map"
          message={t("tips.map")}
          dismissLabel={t("tips.dismiss")}
        />
      </div>

      {/* Scroll controls for desktop with min 44px hitboxes and visible labels */}
      <div className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20">
        <button 
          onClick={scrollLeft} 
          className="min-w-[44px] min-h-[44px] px-2.5 py-1 bg-[#FFD700] border-3 border-[#DAA520] flex items-center justify-center gap-1 hover:bg-[#FFC000] transition-colors shadow-lg"
          style={{ clipPath: "polygon(0 4px, 4px 4px, 4px 0, calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px))" }}
          aria-label={t("map.scrollLeft")}
        >
          <ChevronLeft className="h-5 w-5 text-[#8B4513] shrink-0" />
          <span className="text-xs font-bold text-[#8B4513] hidden lg:inline">{t("map.scrollLeft")}</span>
        </button>
      </div>
      <div className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20">
        <button 
          onClick={scrollRight} 
          className="min-w-[44px] min-h-[44px] px-2.5 py-1 bg-[#FFD700] border-3 border-[#DAA520] flex items-center justify-center gap-1 hover:bg-[#FFC000] transition-colors shadow-lg"
          style={{ clipPath: "polygon(0 4px, 4px 4px, 4px 0, calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px))" }}
          aria-label={t("map.scrollRight")}
        >
          <span className="text-xs font-bold text-[#8B4513] hidden lg:inline">{t("map.scrollRight")}</span>
          <ChevronRight className="h-5 w-5 text-[#8B4513] shrink-0" />
        </button>
      </div>

      {/* Horizontal scrolling map container with accessible label and keyboard scrolling */}
      <div 
        ref={scrollRef}
        tabIndex={0}
        role="region"
        aria-label={t("map.scrollRegionLabel")}
        onKeyDown={handleKeyDown}
        className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide flex justify-start sm:justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700]"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div 
          className="relative h-full min-h-[400px] shrink-0"
          style={{ width: `${mapWidth}px`, imageRendering: "pixelated" }}
        >
          {/* Pixel art ground layers - use full width */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#8B5A2B]" style={{ minWidth: `${mapWidth}px` }} />
          <div className="absolute bottom-12 left-0 right-0 h-4 bg-[#228B22]" style={{ minWidth: `${mapWidth}px` }} />
          <div className="absolute bottom-16 left-0 right-0 h-2 bg-[#32CD32]" style={{ minWidth: `${mapWidth}px` }} />
          
          {/* Road with dashed center line */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-8 bg-[#4A4A4A]" 
            style={{ minWidth: `${mapWidth}px` }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#6B6B6B]" />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#3A3A3A]" />
            <div 
              className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1.5 bg-repeat-x"
              style={{ 
                backgroundImage: "repeating-linear-gradient(90deg, #FFD700 0px, #FFD700 20px, transparent 20px, transparent 40px)",
                minWidth: `${mapWidth}px`,
              }}
            />
          </div>
          
          {/* Pixel art path connecting all levels */}
          {earthLevels.length > 0 && (
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none z-0" 
              style={{ width: `${mapWidth}px`, imageRendering: "pixelated" }}
              preserveAspectRatio="none"
              shapeRendering="crispEdges"
            >
              <path
                d={generatePixelPathD(levelPositions)}
                fill="none"
                stroke="#8B5A2B"
                strokeWidth="12"
                strokeLinecap="square"
                strokeLinejoin="miter"
              />
              <path
                d={generatePixelPathD(levelPositions)}
                fill="none"
                stroke="#D4A574"
                strokeWidth="8"
                strokeLinecap="square"
                strokeLinejoin="miter"
              />
            </svg>
          )}

          {/* Decorative elements - artwork stays visible independently of level data */}
          <MapDecorations mapWidth={mapWidth} />

          {/* World labels - pixel art style for Earth Worlds 1-5 */}
          {earthLevels.length > 0 && earthWorlds.map((world) => {
            const firstLevelIndex = earthLevels.findIndex(l => l.world === world.number);
            if (firstLevelIndex === -1) return null;
            const pos = levelPositions[firstLevelIndex];
            return (
              <div
                key={world.number}
                className="absolute z-10 pointer-events-none"
                style={{ left: `${pos.x - 50}px`, top: "12px" }}
              >
                <div 
                  className="px-4 py-2 bg-[#FFD700] border-3 border-[#DAA520] text-base font-bold text-[#8B4513] max-w-[220px] text-center break-words"
                  style={{ 
                    clipPath: "polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)",
                  }}
                >
                  {t(`worlds.${world.number}.title`)}
                </div>
              </div>
            );
          })}

          {/* Level nodes for Earth Worlds 1-5 */}
          {earthLevels.length > 0 ? (
            earthLevels.map((level, index) => (
              <LevelNode
                key={level.slug}
                level={level}
                position={levelPositions[index]}
                progress={progress}
                index={index}
                t={t}
              />
            ))
          ) : (
            /* Empty state when zero levels are selectable, preserving map artwork and offering Planets */
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pixel-panel p-6 text-center max-w-md">
              <h3 className="text-2xl font-bold text-[#2C1810] mb-2">
                {t("map.emptyHeading")}
              </h3>
              <p className="text-base text-[#5D4037] mb-4">
                {t("map.emptyBody")}
              </p>
              <Link
                href="/planets"
                className="pixel-btn pixel-btn-blue inline-flex items-center gap-2 px-4 py-2 text-sm"
              >
                <PixelRocket className="w-4 h-4" />
                <span>{t("map.explorePlanetsAction")}</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Progress bar at bottom - pixel art style */}
      <div className="shrink-0 px-4 py-3 bg-[#2C1810] border-t-4 border-[#8B4513]">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between text-xl mb-2">
            <span className="font-bold text-2xl text-[#FFD700]">{t("map.title")}</span>
            <div className="flex items-center gap-2">
              <PixelStar filled className="w-6 h-6" />
              <span className="text-[#FFD700] font-bold text-xl">
                {getCompletedCount(progress, earthLevels)} / {earthLevels.length}
              </span>
            </div>
          </div>
          {/* Pixel art progress bar */}
          <div className="h-6 bg-[#4A3728] border-2 border-[#8B4513] relative overflow-hidden">
            <div 
              className="h-full bg-[#22C55E] transition-all duration-500"
              style={{ 
                width: earthLevels.length > 0 ? `${(getCompletedCount(progress, earthLevels) / earthLevels.length) * 100}%` : "0%",
              }}
            />
            {/* Pixel segments overlay */}
            <div className="absolute inset-0 flex">
              {Array.from({ length: Math.max(earthLevels.length, 1) }).map((_, i) => (
                <div 
                  key={i} 
                  className="flex-1 border-r border-[#2C1810] last:border-r-0"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate pixelated path using straight line segments (stair-step pattern)
function generatePixelPathD(positions: { x: number; y: number }[]): string {
  if (positions.length === 0) return "";
  
  let d = `M ${positions[0].x} ${positions[0].y}`;
  
  for (let i = 1; i < positions.length; i++) {
    const prev = positions[i - 1];
    const curr = positions[i];
    const midX = (prev.x + curr.x) / 2;
    d += ` H ${midX}`;
    d += ` V ${curr.y}`;
    d += ` H ${curr.x}`;
  }
  
  return d;
}

function MapDecorations({ mapWidth }: { mapWidth: number }) {
  const [planeY, setPlaneY] = useState(15);
  const [isDragging, setIsDragging] = useState(false);
  const planeRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isDragging) return;
    
    const handleMove = (clientY: number) => {
      const container = planeRef.current?.parentElement;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const y = ((clientY - rect.top) / rect.height) * 100;
      setPlaneY(Math.max(8, Math.min(35, y)));
    };
    
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientY);
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientY);
    const onEnd = () => setIsDragging(false);
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchend', onEnd);
    
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchend', onEnd);
    };
  }, [isDragging]);
  
  const decorations = [];
  const spacing = 100;
  
  for (let i = 0; i < Math.floor(mapWidth / spacing); i++) {
    const x = 50 + i * spacing;
    const type = i % 5;
    const yOffset = Math.sin(i * 0.8) * 10;
    
    decorations.push(
      <div 
        key={`deco-${i}`}
        className="absolute pointer-events-none"
        style={{ 
          left: `${x + (i % 3) * 15}px`, 
          bottom: `${50 + yOffset + (i % 4) * 5}px` 
        }}
      >
        {type === 0 && <PixelTree />}
        {type === 1 && <PixelBush />}
        {type === 2 && <PixelFlower color={i % 2 === 0 ? "#FF69B4" : "#FF6347"} />}
        {type === 3 && <PixelTree className="w-10 h-14" />}
        {type === 4 && <PixelMountain />}
      </div>
    );
  }

  const lakePositions = [
    { x: 210, type: 'lake' },
    { x: 1000, type: 'pond' },
    { x: 2180, type: 'lake' },
    { x: 2920, type: 'pond' },
    { x: 3680, type: 'lake' },
  ];
  
  lakePositions.forEach((lake, i) => {
    if (lake.x < mapWidth - 100) {
      decorations.push(
        <div 
          key={`lake-${i}`}
          className="absolute pointer-events-none"
          style={{ left: `${lake.x}px`, bottom: "50px" }}
        >
          {lake.type === 'lake' ? <PixelLake /> : <PixelPond />}
        </div>
      );
    }
  });

  decorations.push(
    <div 
      key="castle"
      className="absolute pointer-events-none"
      style={{ left: `${mapWidth - 80}px`, bottom: "50px" }}
    >
      <PixelCastle />
    </div>
  );

  decorations.push(
    <div 
      key="car1"
      className="absolute z-[2] group"
      style={{ 
        bottom: "7px",
        transform: "scaleX(-1)",
        animation: `driveLeft ${Math.max(10, mapWidth / 200)}s linear infinite`,
        ["--map-width" as string]: `${mapWidth}px`,
      }}
      onMouseEnter={(e) => e.currentTarget.style.animationPlayState = "paused"}
      onMouseLeave={(e) => e.currentTarget.style.animationPlayState = "running"}
    >
      <div className="absolute -right-8 -bottom-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center" style={{ transform: "scaleX(-1)" }}>
        <div className="w-4 h-10 bg-gray-700 flex flex-col items-center justify-center gap-0.5 p-1">
          <div className="w-2 h-2 bg-red-500 shadow-[0_0_6px_#ef4444]" />
          <div className="w-2 h-2 bg-yellow-800" />
          <div className="w-2 h-2 bg-green-800" />
        </div>
        <div className="w-1.5 h-8 bg-gray-500" />
      </div>
      <PixelCar color="#E74C3C" />
    </div>
  );
  
  decorations.push(
    <div 
      key="van1"
      className="absolute z-[2] group"
      style={{ 
        bottom: "0px",
        transform: "scaleX(-1)",
        animation: `driveLeft ${Math.max(18, mapWidth / 70)}s linear infinite`,
        animationDelay: "-8s",
        ["--map-width" as string]: `${mapWidth}px`,
      }}
      onMouseEnter={(e) => e.currentTarget.style.animationPlayState = "paused"}
      onMouseLeave={(e) => e.currentTarget.style.animationPlayState = "running"}
    >
      <div className="absolute -right-8 -bottom-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center" style={{ transform: "scaleX(-1)" }}>
        <div className="w-4 h-10 bg-gray-700 flex flex-col items-center justify-center gap-0.5 p-1">
          <div className="w-2 h-2 bg-red-500 shadow-[0_0_6px_#ef4444]" />
          <div className="w-2 h-2 bg-yellow-800" />
          <div className="w-2 h-2 bg-green-800" />
        </div>
        <div className="w-1.5 h-8 bg-gray-500" />
      </div>
      <div style={{ animation: "engineVibrate 0.1s steps(2) infinite" }}>
        <PixelVan text="Sekolah Prompt-Fu" />
      </div>
    </div>
  );
  
  decorations.push(
    <div 
      key="car2"
      className="absolute z-[1] group"
      style={{ 
        bottom: "22px",
        animation: `driveRight ${Math.max(12, mapWidth / 90)}s linear infinite`,
        ["--map-width" as string]: `${mapWidth}px`,
      }}
      onMouseEnter={(e) => e.currentTarget.style.animationPlayState = "paused"}
      onMouseLeave={(e) => e.currentTarget.style.animationPlayState = "running"}
    >
      <div className="absolute -right-8 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center">
        <div className="w-4 h-10 bg-gray-700 flex flex-col items-center justify-center gap-0.5 p-1">
          <div className="w-2 h-2 bg-red-500 shadow-[0_0_6px_#ef4444]" />
          <div className="w-2 h-2 bg-yellow-800" />
          <div className="w-2 h-2 bg-green-800" />
        </div>
        <div className="w-1.5 h-8 bg-gray-500" />
      </div>
      <div style={{ animation: "engineVibrate 0.1s steps(2) infinite" }}>
        <PixelOldCar />
      </div>
    </div>
  );

  decorations.push(
    <div 
      key="plane"
      ref={planeRef}
      className="absolute z-10 cursor-grab active:cursor-grabbing select-none"
      style={{ 
        top: `${planeY}%`,
        animation: `flyPlaneMap ${Math.max(20, mapWidth / 50)}s linear infinite`,
        ["--map-width" as string]: `${mapWidth}px`,
      }}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
    >
      <PixelPlaneWithBanner bannerText="Sekolah Prompt-Fu" />
    </div>
  );

  return <>{decorations}</>;
}

function getCompletedCount(progress: KidsProgress | null, levels: Level[]): number {
  if (!progress) return 0;
  return levels.filter(l => progress.levels[l.slug]?.completed).length;
}

interface LevelNodeProps {
  level: Level;
  position: { x: number; y: number };
  progress: KidsProgress | null;
  index: number;
  t: ReturnType<typeof useTranslations>;
}

function LevelNode({ level, position, progress, index, t }: LevelNodeProps) {
  const [unlocked, setUnlocked] = useState(false);
  const levelProgress = progress?.levels[level.slug];
  const isCompleted = levelProgress?.completed;
  const stars = levelProgress?.stars || 0;

  useEffect(() => {
    setUnlocked(isLevelUnlocked(level.slug));
  }, [level.slug, progress]);

  const state = !unlocked ? "locked" : isCompleted ? "completed" : "available";

  const nodeContent = (
    <div 
      className={cn(
        "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
        "animate-in fade-in zoom-in",
        unlocked && !isCompleted && "hover:scale-110",
        isCompleted && "hover:scale-110",
      )}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}%`,
        animationDelay: `${index * 100}ms`,
      }}
    >
      <PixelLevelNode 
        state={state}
        levelNumber={`${level.world}.${level.levelNumber}`}
      />
      
      {isCompleted && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0">
          {[1, 2, 3].map((star) => (
            <PixelStar key={star} filled={star <= stars} />
          ))}
        </div>
      )}
      
      <div 
        className="absolute top-full mt-6 left-1/2 -translate-x-1/2 px-3 py-2 text-base font-bold bg-amber-100 dark:bg-amber-900 border-2 border-amber-400 max-w-[180px] text-center break-words"
        style={{ 
          clipPath: "polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)",
        }}
      >
        {t(`levels.${level.slug.replace(/-/g, "_")}.title`)}
      </div>
    </div>
  );

  if (!unlocked) {
    return (
      <div 
        className="group cursor-not-allowed select-none"
        aria-disabled="true"
        title={t("map.locked")}
      >
        {nodeContent}
      </div>
    );
  }

  const localizedTitle = t(`levels.${level.slug.replace(/-/g, "_")}.title`);

  return (
    <Link 
      href={buildLessonUrl(level.slug, "map")} 
      className="group cursor-pointer min-h-[44px] min-w-[44px]"
      aria-label={`${localizedTitle} (${level.world}.${level.levelNumber})`}
    >
      {nodeContent}
    </Link>
  );
}
