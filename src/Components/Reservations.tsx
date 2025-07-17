import { FaDiamond } from "react-icons/fa6";
import { Button } from "@material-tailwind/react";
import { IContent } from "../interfaces/content";

interface ContentProps {
    content: null | IContent;
    setContent: Function;
}

export default function Reservation({ content }: ContentProps) {
    return (
        <>
            <span className="anchor" id="reservation"></span>
            <div className="flex flex-col w-full max-w-screen-md mx-auto px-4 pb-20 sm:pb-40">
                <h1 className="text-2xl sm:text-3xl text-black text-center pb-5">
                    {content?.reservation_title}
                </h1>

                <p className="text-sm sm:text-md text-center mb-6">
                    {content?.reservation_text}
                </p>

                <div className="my-4 flex justify-center items-center">
                    <FaDiamond className="text-base sm:text-lg text-black" />
                </div>

                {[
                    {
                        title: "Breakfast",
                        dayOne: content?.breakfast_timing_day_one,
                        hoursOne: content?.breakfast_timing_hours_one,
                        dayTwo: content?.breakfast_timing_day_two,
                        hoursTwo: content?.breakfast_timing_hours_two,
                    },
                    {
                        title: "Lunch",
                        dayOne: content?.lunch_timing_day_one,
                        hoursOne: content?.lunch_timing_hours_one,
                        dayTwo: content?.lunch_timing_day_two,
                        hoursTwo: content?.lunch_timing_hours_two,
                    },
                    {
                        title: "Dinner",
                        dayOne: content?.dinner_timing_day_one,
                        hoursOne: content?.dinner_timing_hours_one,
                        dayTwo: content?.dinner_timing_day_two,
                        hoursTwo: content?.dinner_timing_hours_two,
                    },
                ].map(({ title, dayOne, hoursOne, dayTwo, hoursTwo }) => (
                    <div key={title} className="pb-10">
                        <h5 className="text-2xl sm:text-3xl text-black text-center pb-5 font-semibold">
                            {title}
                        </h5>
                        <p className="text-md text-center font-extrabold">{dayOne}</p>
                        <p className="text-sm sm:text-md text-center font-thin italic pb-3">
                            {hoursOne}
                        </p>
                        <p className="text-md text-center font-extrabold">{dayTwo}</p>
                        <p className="text-sm sm:text-md text-center font-thin italic">
                            {hoursTwo}
                        </p>
                    </div>
                ))}

                <div className="flex justify-center pb-10">
                    <Button
                        size="lg"
                        className="text-center w-40 h-14 sm:h-16 bg-black text-beige"
                        nonce={undefined}
                        onResize={undefined}
                        onResizeCapture={undefined}
                    >
                        Book Now
                    </Button>
                </div>

                <p className="text-sm sm:text-md text-center mb-1">
                    {content?.reservation_line_one}
                </p>
                <p className="text-sm sm:text-md text-center mb-2">
                    {content?.reservation_line_two}
                </p>
                <a href={"tel:" + content?.phone} className="text-center block mb-1">
                    <p className="text-sm sm:text-md text-center text-blue-600 hover:underline cursor-pointer">
                        {content?.phone}
                    </p>
                </a>
                <a href={"mailto:" + content?.email} className="text-center block">
                    <p className="text-sm sm:text-md text-center text-blue-600 hover:underline cursor-pointer">
                        {content?.email}
                    </p>
                </a>
            </div>
        </>
    );
}