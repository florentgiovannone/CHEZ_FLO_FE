import React, { useEffect, useRef } from "react";
import { IGrid } from "../interfaces/grid";

interface GridGalleryProps {
    grid: IGrid[];
    setGrid: Function;
}

export default function GridGallery({ grid, setGrid }: GridGalleryProps) {
    const getImageByPosition = (position: number): string => {
        const image = grid.find((item) => item.position === position);
        return image?.grid_url || "";
    };

    // Refs for each column
    const colRefs = [
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
    ];

    useEffect(() => {
        const scrollStep = 1;
        const intervalTime = 15;
        const scrollAmounts = [0, 0, 0, 0];
        const directions = [1, -1, 1, -1]; // 1 for up, -1 for down

        // Initialize starting positions
        colRefs.forEach((ref, i) => {
            const el = ref.current;
            if (!el) return;

            if (directions[i] === -1) {
                // Start columns 2 and 4 from the bottom
                scrollAmounts[i] = el.scrollHeight / 2;
                el.style.transform = `translateY(-${scrollAmounts[i]}px)`;
            }
        });

        const interval = setInterval(() => {
            colRefs.forEach((ref, i) => {
                const el = ref.current;
                if (!el) return;

                // Move each column based on direction
                scrollAmounts[i] += scrollStep * directions[i];
                el.style.transform = `translateY(-${scrollAmounts[i]}px)`;

                // Reset when reaching the end
                if (directions[i] === 1 && scrollAmounts[i] >= el.scrollHeight / 2) {
                    scrollAmounts[i] = 0;
                    el.style.transform = `translateY(0)`;
                } else if (directions[i] === -1 && scrollAmounts[i] <= 0) {
                    scrollAmounts[i] = el.scrollHeight / 2;
                    el.style.transform = `translateY(-${scrollAmounts[i]}px)`;
                }
            });
        }, intervalTime);

        return () => clearInterval(interval);
    }, []);

    const colPositions = [
        [1, 2, 3],
        [4, 5, 6],
        [3, 6, 1],
        [2, 5, 4],
    ];

    const colImages = colPositions.map((arr) => [...arr, ...arr]);

    // Tailwind responsive height classes
    const responsiveHeight = "h-[300px] sm:h-[500px] lg:h-[600px]";

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4 mb-10">
            {colImages.map((images, colIndex) => (
                <div
                    key={colIndex}
                    className={`overflow-hidden ${responsiveHeight} ${colIndex === 2
                        ? "hidden sm:block"
                        : colIndex === 3
                            ? "hidden lg:block"
                            : "block"
                        }`}
                >
                    <div
                        className="grid gap-4"
                        ref={colRefs[colIndex]}
                        style={{ willChange: "transform" }}
                    >
                        {images.map((pos, idx) => (
                            <div key={idx}>
                                <img
                                    className="w-full h-auto rounded-lg object-cover object-center"
                                    src={getImageByPosition(pos)}
                                    alt={`gallery-photo-${pos}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}