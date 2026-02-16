"use client";

import { useState, useEffect } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { getCurrentDay } from "../../lib/dateHelpers";
import { CountdownItem } from "@/lib/googleSheets";

export const defaultImage = "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29tbXVuaXR5fGVufDB8fDB8fHww";

interface MasonryViewProps {
  actions: CountdownItem[];
}

// Shuffle array helper
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Assign random heights for Pinterest-style layout
const heights = [200, 250, 300, 350, 280, 320, 240, 360];

// Random overlay colors (25% opacity)
// Standard Tailwind colors. We'll use style / arbitrary values if needed, 
// but modern Tailwind supports /25 on standard colors.
// If /25 fails, we can use 'bg-red-600 bg-opacity-25'.
// Let's use generic RGBA for safety or standard classes.
// The user asked for "red, white or blue" with 25% opacity.
const overlayClasses = [
  "bg-red-600/25",
  "bg-blue-600/25",
  "bg-white/25",
];

export function MasonryView({ actions }: MasonryViewProps) {
  // Initialize state
  const [shuffledActions, setShuffledActions] = useState<any[]>([]);
  const [currentDay, setCurrentDay] = useState<number>(0);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Determine current day only on client
    setCurrentDay(getCurrentDay());

    // Shuffle and assign properties only on client to ensure deterministic render match
    const shuffled = shuffleArray(actions).map((action, index) => {
      const overlayClass =
        overlayClasses[Math.floor(Math.random() * overlayClasses.length)];
      return {
        ...action,
        height: heights[index % heights.length],
        overlayClass: overlayClass,
        // Text color logic: if overlay is white/25, white text is still okay if image is dark.
        // But to be safe, we can enforce shadow.
      };
    });
    setShuffledActions(shuffled);
    setIsMounted(true);
  }, [actions]);

  const handleCardClick = (key: string, e: React.MouseEvent) => {
    e.preventDefault();
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleLinkClick = (link: string, key: string, e: React.MouseEvent) => {
    if (!flippedCards.has(key)) {
      e.preventDefault();
      setFlippedCards((prev) => new Set(prev).add(key));
    } else {
      // Allow the link to work normally
      window.open(link, "_blank", "noopener,noreferrer");
      e.preventDefault();
    }
  };

  // Prevent hydration mismatch
  if (!isMounted) {
    return <div className="w-full h-96 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>;
  }

  return (
    <div className="w-full">
      <style>{`
        .card-flip {
          perspective: 1000px;
          width: 100%;
        }
        .card-flip-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        .card-flip.flipped .card-flip-inner {
          transform: rotateY(180deg);
        }
        .card-front,
        .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          top: 0;
          left: 0;
        }
        .card-back {
          transform: rotateY(180deg);
        }
      `}</style>
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 350: 2, 768: 3, 1024: 4 }}
        gutterBreakPoints={{ 350: "1rem", 640: "1.5rem", 1024: "2rem" }}
      >
        <Masonry>
          {shuffledActions.map((action) => {
            const actionDay = action.date.getDate;
            const actionKey = action.date.toISOString();
            const isToday = actionDay === currentDay;
            const isFlipped = flippedCards.has(actionKey);

            return (
              <div
                key={actionKey}
                className={`card-flip cursor-pointer rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] ${isFlipped ? "flipped" : ""}`}
                onClick={(e) => handleCardClick(actionKey, e)}
              >
                <div
                  className="card-flip-inner"
                  style={{ height: `${action.height}px` }}
                >
                  {/* Front: Image Background + Overlay + Date */}
                  <div className="card-front relative rounded-lg overflow-hidden">
                    {/* Background Image */}
                    <img
                      src={action.image || defaultImage}
                      alt={action.headline}
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Colored Overlay (25% opacity) */}
                    {/* TODO: If you want to go back to random color overlays, uncomment */}
                    {/* <div className={`absolute inset-0 ${action.overlayClass} transition-colors duration-300`}></div> */}
                    <div className={`absolute inset-0 bg-black/25 transition-colors duration-300`}></div>

                    {/* Content (Date) */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center p-4">
                        <div className="text-7xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                          {`${action.date.getMonth() + 1}/${action.date.getDate()}`}
                        </div>
                        {isToday && (
                          <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg mt-2 inline-block">
                            Today
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Back: Content (Image + Headline + Link) */}
                  <div
                    className="card-back bg-white flex flex-col h-full rounded-lg overflow-hidden"
                    onClick={(e) => handleLinkClick(action.link_url, actionKey, e)}
                  >
                    <div className="relative h-full flex flex-col">
                      {/* Image header on back - flexible height, can shrink */}
                      <div className="relative flex-1 overflow-hidden min-h-0">
                        <img
                          src={action.image || defaultImage}
                          alt={action.headline}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20"></div>
                      </div>

                      <div className="p-5 bg-white flex-shrink-0 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900 leading-tight text-lg mb-2">
                            {action.headline}
                          </h3>
                          <p className="text-zinc-600 text-sm">
                            {action.details}
                          </p>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                            <span>Take Action</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
}