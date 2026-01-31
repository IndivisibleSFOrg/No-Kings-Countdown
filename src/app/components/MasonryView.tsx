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

// Random colors for card backs
const backColors = [
  "bg-gradient-to-br from-red-500 to-red-600 border-red-700",
  "bg-gradient-to-br from-blue-500 to-blue-600 border-blue-700",
  "bg-white border-gray-300",
];

export function MasonryView({ actions }: MasonryViewProps) {
  // Initialize state
  const [shuffledActions, setShuffledActions] = useState<any[]>([]);
  const [currentDay, setCurrentDay] = useState<number>(0);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Determine current day only on client
    setCurrentDay(getCurrentDay());

    // Shuffle and assign properties only on client to ensure deterministic render match
    const shuffled = shuffleArray(actions).map((action, index) => {
      const randomColor =
        backColors[Math.floor(Math.random() * backColors.length)];
      return {
        ...action,
        height: heights[index % heights.length],
        backColor: randomColor,
        textColor:
          randomColor === "bg-white border-gray-300"
            ? "text-gray-800"
            : "text-white",
      };
    });
    setShuffledActions(shuffled);
    setIsMounted(true);
  }, [actions]);

  const handleCardClick = (date: number, e: React.MouseEvent) => {
    e.preventDefault();
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(date)) {
        newSet.delete(date);
      } else {
        newSet.add(date);
      }
      return newSet;
    });
  };

  const handleLinkClick = (link: string, date: number, e: React.MouseEvent) => {
    if (!flippedCards.has(date)) {
      e.preventDefault();
      setFlippedCards((prev) => new Set(prev).add(date));
    } else {
      // Allow the link to work normally
      window.open(link, "_blank", "noopener,noreferrer");
      e.preventDefault();
    }
  };

  // Prevent hydration mismatch by not rendering the random/time-dependent content until mounted
  // We can render a shell or just return null. Returning null is safest for mismatch.
  if (!isMounted) {
    return <div className="w-full h-96 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>;
  }

  return (
    <div className="w-full px-4 md:px-8">
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
        columnsCountBreakPoints={{ 350: 1, 640: 2, 1024: 3, 1280: 4 }}
      >
        <Masonry gutter="1rem">
          {shuffledActions.map((action) => {
            const isToday = action.date === currentDay;
            const isPast = action.date < currentDay;
            const isFlipped = flippedCards.has(action.date);

            return (
              <div
                key={action.date}
                className={`card-flip cursor-pointer ${isFlipped ? "flipped" : ""}`}
                onClick={(e) => handleCardClick(action.date, e)}
              >
                <div
                  className="card-flip-inner rounded-lg"
                  style={{ height: `${action.height}px` }}
                >
                  {/* Front of card (face-down, showing only date) */}
                  <div
                    className={`card-front rounded-lg border-4 shadow-lg flex items-center justify-center transition-all hover:shadow-xl ${action.backColor}`}
                  >
                    <div className="text-center">
                      <div className={`text-7xl font-bold mb-2 ${action.textColor}`}>
                        {action.date}
                      </div>
                      {isToday && (
                        <div className="bg-black/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
                          Today
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Back of card (face-up, showing content) */}
                  <div
                    className={`card-back rounded-lg border-4 overflow-hidden shadow-lg ${isToday
                      ? "border-blue-600"
                      : isPast
                        ? "border-gray-300"
                        : "border-red-400"
                      }`}
                    onClick={(e) => handleLinkClick(action.link, action.date, e)}
                  >
                    <div className="relative h-full flex flex-col">
                      {/* Image with gradient overlay */}
                      <div className="relative flex-1 overflow-hidden min-h-0">
                        <img
                          src={action.image || defaultImage}
                          alt={action.headline}
                          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                        />
                        {/* Dark gradient overlay for better text contrast */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"></div>

                        {/* Floating date badge with modern styling */}
                        <div
                          className={`absolute top-3 right-3 w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white shadow-xl backdrop-blur-sm border-2 border-white/30 ${isToday
                            ? "bg-gradient-to-br from-blue-500 to-blue-700"
                            : isPast
                              ? "bg-gradient-to-br from-gray-400 to-gray-600"
                              : "bg-gradient-to-br from-red-500 to-red-700"
                            }`}
                        >
                          <div className="text-center">
                            <div className="text-xl leading-none">{action.date}</div>
                          </div>
                        </div>

                        {/* Today badge with glow effect */}
                        {isToday && (
                          <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl border-2 border-white/30 animate-pulse">
                            ✦ Today
                          </div>
                        )}
                      </div>

                      {/* Content area with modern styling */}
                      <div className="p-5 bg-gradient-to-br from-white to-gray-50 flex-shrink-0 relative">
                        {/* Decorative corner accent */}
                        <div className={`absolute top-0 left-0 w-16 h-1 ${isToday
                          ? "bg-gradient-to-r from-blue-600 to-transparent"
                          : isPast
                            ? "bg-gradient-to-r from-gray-400 to-transparent"
                            : "bg-gradient-to-r from-red-500 to-transparent"
                          }`}></div>

                        <h3 className="font-bold text-gray-900 leading-tight text-base mb-3">
                          {action.headline}
                        </h3>

                        {/* Call to action with icon */}
                        <div className={`inline-flex items-center gap-2 text-sm font-semibold rounded-full px-4 py-2 transition-all hover:gap-3 ${isToday
                          ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                          : isPast
                            ? "text-gray-600 bg-gray-100 hover:bg-gray-200"
                            : "text-red-600 bg-red-50 hover:bg-red-100"
                          }`}>
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
            );
          })}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
}