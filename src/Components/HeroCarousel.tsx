import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa";
import { useState } from "react";

export function HeroCarousel({ slides }: { slides: string[] | undefined }) {
  let [current, setCurrent] = useState(0);

  const safeSlides = slides || [];

  const previousSlide = () => {
    setCurrent(current === 0 ? safeSlides.length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent(current === safeSlides.length - 1 ? 0 : current + 1);
  };

  return (
    <div className="overflow-hidden relative">
      <div
        className="flex transition ease-out duration-400"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {safeSlides.map((s, index) => (
          <img key={index} src={s} alt={`Slide ${index + 1}`} />
        ))}
      </div>
      <div className="absolute top-0 h-full w-full justify-between items-center flex text-black px-10 text-3xl">
        <button onClick={previousSlide}>
          <FaArrowCircleLeft />
        </button>
        <button onClick={nextSlide}>
          <FaArrowCircleRight />
        </button>
      </div>
      <div className="absolute bottom-0 py-4 flex justify-center gap-10 w-full cursor-pointer">
        {safeSlides.map((s, i) => (
          <div
            onClick={() => setCurrent(i)}
            key={"circle" + i}
            className={`rounded-full w-5 h-5 ${i === current ? "bg-black" : "bg-beige"}`}
          ></div>
        ))}
      </div>
    </div>
  );
}