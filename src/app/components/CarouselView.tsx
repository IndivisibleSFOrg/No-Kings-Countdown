"use client";

import { useRef, useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getCurrentDay } from "../../lib/dateHelpers";
import { CountdownItem } from "@/lib/googleSheets";
import { defaultImage } from "./MasonryView";

interface CarouselViewProps {
  actions: CountdownItem[];
}

export function CarouselView({ actions }: CarouselViewProps) {
  const [currentDay, setCurrentDay] = useState<number>(0);
  const sliderRef = useRef<Slider>(null);

  useEffect(() => {
    // Set current day on mount
    const day = getCurrentDay();
    setCurrentDay(day);

    // Auto-scroll to current day on mount and refresh slider
    if (sliderRef.current) {
      const currentIndex = actions.findIndex((a) => a.date === day);
      if (currentIndex >= 0) {
        sliderRef.current.slickGoTo(currentIndex);
      }
      // Force slider to recalculate dimensions
      setTimeout(() => {
        sliderRef.current?.slickGoTo(currentIndex >= 0 ? currentIndex : 0);
      }, 100);
    }
  }, [actions]);

  const settings = {
    centerMode: true,
    centerPadding: "0px",
    slidesToShow: 3,
    speed: 500,
    focusOnSelect: true,
    infinite: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: "20px",
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          centerPadding: "15px",
        },
      },
    ],
  };

  return (
    <div className="w-full px-4 md:px-12 carousel-container">
      <style>{`
        .carousel-container .slick-slide {
          transition: all 0.3s ease;
          opacity: 0.5;
          transform: scale(0.85);
        }
        .carousel-container .slick-slide.slick-center {
          opacity: 1;
          transform: scale(1);
          z-index: 10;
        }
        .carousel-container .slick-prev,
        .carousel-container .slick-next {
          z-index: 20;
          width: 40px;
          height: 40px;
        }
        .carousel-container .slick-prev:before,
        .carousel-container .slick-next:before {
          font-size: 40px;
          color: #dc2626;
        }
        .carousel-container .slick-prev {
          left: -50px;
        }
        .carousel-container .slick-next {
          right: -50px;
        }
      `}</style>
      <Slider ref={sliderRef} {...settings}>
        {actions.map((action) => {
          const isToday = action.date === currentDay;
          const isPast = action.date < currentDay;

          return (
            <div key={action.date} className="px-3">
              <a
                href={action.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`block overflow-hidden rounded-xl border-4 transition-all duration-300 hover:shadow-2xl ${isToday
                  ? "border-blue-600 shadow-xl"
                  : isPast
                    ? "border-gray-300"
                    : "border-red-500"
                  }`}
              >
                <div className="relative">
                  <img
                    src={action.image || defaultImage}
                    alt={action.headline}
                    className="w-full h-80 object-cover"
                  />
                  <div
                    className={`absolute top-4 right-4 w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-xl shadow-lg ${isToday
                      ? "bg-blue-600"
                      : isPast
                        ? "bg-gray-400"
                        : "bg-red-500"
                      }`}
                  >
                    {action.date}
                  </div>
                  {isToday && (
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                      Today's Action
                    </div>
                  )}
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {action.headline}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Click to learn more →
                  </p>
                </div>
              </a>
            </div>
          );
        })}
      </Slider>
    </div>
  );
}