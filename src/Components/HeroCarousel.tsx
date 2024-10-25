import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa";
import { useState } from "react";

export function HeroCarousel({ slides }: any) {
  let [current, setCurrent] = useState(0);  // Initialize with a valid index

  let previousSlide = () => {
    if (current === 0) setCurrent(slides.length - 1);
    else setCurrent(current - 1);
  };

  let nextSlide = () => {
    if (current === slides.length - 1) setCurrent(0);  // Cycle back to first slide
    else setCurrent(current + 1);
  };

  return (
    <div className="overflow-hidden relative">
      <div
        className="flex transition ease-out duration-400"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((s: string, index: number) => {
          return <img key={index} src={s} alt="Hero images carousel" />;
        })}
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
        { slides.map((s: any, i: number) => {
          return (
          <div onClick={()=> {
            setCurrent(i)
          }} key={"circle" + i}  className={`rounded-full w-5 h-5 ${i===current ? "bg-black" : "bg-beige"}`}></div>)
})}

      </div>
    </div>
    
  );
}