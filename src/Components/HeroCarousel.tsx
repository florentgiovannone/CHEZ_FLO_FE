import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa";
import { useState, useEffect } from "react";

export function HeroCarousel({ slides }: { slides: string[] | undefined }) {
  const [current, setCurrent] = useState(0);
  const safeSlides = slides || [];

  const previousSlide = () => {
    setCurrent(current === 0 ? safeSlides.length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent(current === safeSlides.length - 1 ? 0 : current + 1);
  };

  // Auto-advance carousel every 2 seconds
  useEffect(() => {
    if (safeSlides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent(current === safeSlides.length - 1 ? 0 : current + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, [current, safeSlides.length]);

  return (
    <div className="relative overflow-hidden w-full h-screen">
      <div
        className="flex transition-transform ease-out duration-500 w-full h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {safeSlides.map((s, index) => (
          <img
            key={index}
            src={s}
            alt={`Slide ${index + 1}`}
            className="w-full flex-shrink-0 h-full object-cover"
          />
        ))}
      </div>

      {/* Arrows */}
      <div className="absolute inset-0 flex justify-between items-center px-4 sm:px-10 text-2xl sm:text-3xl text-white z-0">
        <button
          onClick={previousSlide}
          aria-label="Previous Slide"
          className="hover:text-gray-300 focus:outline-none"
        >
          <FaArrowCircleLeft />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="hover:text-gray-300 focus:outline-none"
        >
          <FaArrowCircleRight />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 sm:gap-5 z-0">
        {safeSlides.map((_, i) => (
          <div
            key={"circle" + i}
            onClick={() => setCurrent(i)}
            className={`rounded-full w-3 h-3 sm:w-4 sm:h-4 transition-colors duration-300 cursor-pointer ${i === current ? "bg-black" : "bg-beige"
              }`}
          />
        ))}
      </div>
    </div>
  );
}