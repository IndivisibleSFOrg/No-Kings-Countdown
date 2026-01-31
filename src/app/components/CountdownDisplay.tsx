"use client";

import { useState } from "react";
import { Grid3x3, Slice } from "lucide-react";
import { MasonryView } from "./MasonryView";
import { CarouselView } from "./CarouselView";
import { CountdownItem } from "@/lib/googleSheets";

type LayoutType = "masonry" | "carousel";

interface CountdownDisplayProps {
    actions: CountdownItem[];
}

export function CountdownDisplay({ actions }: CountdownDisplayProps) {
    const [layout, setLayout] = useState<LayoutType>("masonry");

    return (
        <>
            {/* Header */}
            <header className="bg-white border-b-4 border-red-500 shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-blue-600 to-red-600 bg-clip-text text-transparent">
                                Community Action Calendar
                            </h1>
                            <p className="mt-2 text-gray-600">
                                30 ways to make a difference in your community
                            </p>
                        </div>

                        {/* Layout Switcher */}
                        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => setLayout("masonry")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${layout === "masonry"
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                <Grid3x3 className="w-4 h-4" />
                                <span className="hidden sm:inline">Grid View</span>
                            </button>
                            <button
                                onClick={() => setLayout("carousel")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${layout === "carousel"
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                <Slice className="w-4 h-4" />
                                <span className="hidden sm:inline">Carousel View</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="py-8 md:py-12">
                {layout === "masonry" ? (
                    <MasonryView actions={actions} />
                ) : (
                    <div className="max-w-6xl mx-auto">
                        <CarouselView key="carousel" actions={actions} />
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="mt-16 bg-gradient-to-r from-red-600 to-blue-600 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-lg font-semibold">
                        Every action counts. Start making a difference today!
                    </p>
                    <p className="mt-2 text-sm text-white/80">
                        Together, we can build stronger, more connected communities.
                    </p>
                </div>
            </footer>
        </>
    );
}
