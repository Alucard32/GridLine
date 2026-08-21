'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MapPin, Mountain } from 'lucide-react';
import { POSTER_EXAMPLES } from '@/lib/config/examples';
import { PosterThumbnail } from '../map/PosterThumbnail';
import { floatingPoster } from '@/lib/animations/landing';

// Fallback to static examples if no thumbnails provided
const HERO_POSTERS = [
  POSTER_EXAMPLES[0], // Chesapeake Bay - Vintage
  POSTER_EXAMPLES[1], // Salt Lake City - Midnight
  POSTER_EXAMPLES[3], // San Francisco Noir - Dark Mode
  POSTER_EXAMPLES[8], // Kennedy Space Center - Topographic
];

interface RouteThumbnail {
  url: string;
  title: string;
}

interface HeroSectionProps {
  thumbnails?: RouteThumbnail[];
}

export function HeroSection({ thumbnails = [] }: HeroSectionProps) {
  const useThumbnails = thumbnails.length >= 4;
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax transforms for floating posters
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const parallaxY = [y1, y2, y3, y4];

  return (
    <section
      ref={containerRef}
      className="relative min-h-dvh flex items-center justify-center overflow-hidden"
    >
      {/* Background with topographic pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-stone-50 to-primary/5 dark:from-stone-900 dark:via-stone-900 dark:to-primary/10" />

      {/* Subtle topographic texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5C20 15 10 20 5 30s5 20 25 25c20-5 25-15 25-25S40 15 30 5z' fill='none' stroke='%232D5A3D' stroke-width='0.5'/%3E%3Cpath d='M30 15C23 22 18 25 15 30s3 12 15 15c12-3 15-8 15-15s-8-13-15-15z' fill='none' stroke='%232D5A3D' stroke-width='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating Posters - Desktop Only */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none">
        {(useThumbnails ? thumbnails.slice(0, 4) : HERO_POSTERS).map((item, index) => {
          // Position posters around the edges
          const positions = [
            { left: '8%', top: '15%', rotate: -8 },
            { right: '6%', top: '12%', rotate: 6 },
            { left: '5%', bottom: '18%', rotate: -4 },
            { right: '8%', bottom: '15%', rotate: 5 },
          ];
          const pos = positions[index];
          const isThumbnail = useThumbnails && 'url' in item;
          const key = isThumbnail ? (item as RouteThumbnail).title : (item as typeof HERO_POSTERS[0]).id;

          return (
            <motion.div
              key={key}
              className="absolute"
              style={{
                ...pos,
                y: parallaxY[index],
                width: 'clamp(160px, 14vw, 220px)',
              }}
              initial={floatingPoster(index).initial}
              animate={floatingPoster(index).animate}
            >
              <div
                className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-white/20 dark:border-white/10 transform-gpu hover:scale-105 transition-transform duration-500"
                style={{ transform: `rotate(${pos.rotate}deg)` }}
              >
                {isThumbnail ? (
                  <Image
                    src={(item as RouteThumbnail).url}
                    alt={(item as RouteThumbnail).title}
                    fill
                    className="object-cover"
                    sizes="220px"
                  />
                ) : (
                  <PosterThumbnail
                    config={(item as typeof HERO_POSTERS[0]).config}
                    className="w-full h-full"
                  />
                )}
              </div>
              {/* Style badge */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm shadow-lg">
                <span className="text-[10px] font-semibold text-stone-600 dark:text-stone-300 whitespace-nowrap">
                  {isThumbnail ? (item as RouteThumbnail).title : (item as typeof HERO_POSTERS[0]).config.style.name}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content — compressed on mobile / short viewports for scaled text & Chrome UI */}
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6 py-12 sm:py-16 md:py-20 text-center [@media(max-height:640px)]:py-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 mb-5 sm:mb-8 [@media(max-height:640px)]:mb-3"
        >
          <Mountain className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
          <span className="text-xs sm:text-sm font-medium text-primary">Turn adventures into art</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-stone-900 dark:text-white leading-[1.1] tracking-tight mb-4 sm:mb-6 [@media(max-height:640px)]:text-[1.75rem] [@media(max-height:640px)]:mb-3"
        >
          Your Journey.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-accent">
            Your Masterpiece.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto mb-6 sm:mb-10 leading-relaxed [@media(max-height:640px)]:text-sm [@media(max-height:640px)]:mb-4"
        >
          Transform your hiking trails, running routes, and travel memories into stunning
          wall art. Draw a route, upload a GPX file, or import from Strava.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <Link
            href="/create"
            className="group inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 hover:-translate-y-0.5 text-sm sm:text-base"
          >
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            Create Your First Print
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/feed"
            className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 font-semibold rounded-xl border-2 border-stone-200 dark:border-stone-700 transition-all duration-300 hover:-translate-y-0.5 text-sm sm:text-base"
          >
            Explore the Community
          </Link>
        </motion.div>

        {/* Mobile Poster Preview — smaller cards; hide on short viewports so CTAs stay visible */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="lg:hidden mt-8 sm:mt-12 flex justify-center gap-3 sm:gap-4 overflow-x-auto pb-2 sm:pb-4 px-4 -mx-5 sm:-mx-6 [@media(max-height:640px)]:hidden"
        >
          {(useThumbnails ? thumbnails.slice(0, 3) : HERO_POSTERS.slice(0, 3)).map((item, index) => {
            const isThumbnail = useThumbnails && 'url' in item;
            const key = isThumbnail ? (item as RouteThumbnail).title : (item as typeof HERO_POSTERS[0]).id;

            return (
              <div
                key={key}
                className="flex-shrink-0 w-24 sm:w-32 md:w-40"
                style={{ transform: `rotate(${-4 + index * 4}deg)` }}
              >
                <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-xl border border-white/20 relative">
                  {isThumbnail ? (
                    <Image
                      src={(item as RouteThumbnail).url}
                      alt={(item as RouteThumbnail).title}
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  ) : (
                    <PosterThumbnail
                      config={(item as typeof HERO_POSTERS[0]).config}
                      className="w-full h-full"
                    />
                  )}
                </div>
                <p className="mt-1.5 sm:mt-2 text-[10px] font-medium text-stone-500 dark:text-stone-400 text-center truncate">
                  {isThumbnail ? (item as RouteThumbnail).title : (item as typeof HERO_POSTERS[0]).config.style.name}
                </p>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Scroll indicator — desktop / tall viewports only (avoids overlapping CTAs on phones) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 hidden sm:block [@media(max-height:640px)]:hidden"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-stone-300 dark:border-stone-600 flex items-start justify-center p-2"
        >
          <div className="w-1.5 h-2.5 bg-stone-400 dark:bg-stone-500 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
