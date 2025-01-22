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
            <span className='anchor' id='reservation'></span>
            <div className="flex flex-col w-2/3 mx-auto pb-40">
            
                <h1 className=" text-3xl text-black text-center pb-5">{content?.reservation_title}</h1>
                <p className="text-md text-center">
                    {content?.reservation_text}
                </p>
                <div className="m-5 flex justify-center items-center">
                    <FaDiamond className="text-sm"></FaDiamond>
                </div>
                <div className="pb-10">
                    <h5 className=" text-3xl text-black text-center pb-5">Breakfast</h5>
                    <p className="text-md text-center font-extrabold">
                        {content?.breakfast_timing_day_one}
                    </p>
                    <p className="text-md text-center font-thin italic pb-3">
                        {content?.breakfast_timing_hours_one}
                    </p>
                    <p className="text-md text-center font-extrabold">
                        {content?.breakfast_timing_day_two}
                    </p>
                    <p className="text-md text-center font-thin italic ">
                        {content?.breakfast_timing_hours_two}
                    </p>
                </div>
                <div className="pb-10">
                    <h5 className=" text-3xl text-black text-center pb-5">Lunch</h5>
                    <p className="text-md text-center font-extrabold">
                        {content?.lunch_timing_day_one}
                    </p>
                    <p className="text-md text-center font-thin italic pb-3">
                        {content?.lunch_timing_hours_one}
                    </p>
                    <p className="text-md text-center font-extrabold">
                        {content?.lunch_timing_day_two}
                    </p>
                    <p className="text-md text-center font-thin italic ">
                        {content?.lunch_timing_hours_two}
                    </p>
                </div>
                <div className="pb-10">
                    <h5 className=" text-3xl text-black text-center pb-5">Dinner</h5>
                    <p className="text-md text-center font-extrabold">
                        {content?.dinner_timing_day_one}
                    </p>
                    <p className="text-md text-center font-thin italic pb-3">
                        {content?.dinner_timing_hours_one}
                    </p>
                    <p className="text-md text-center font-extrabold">
                        {content?.dinner_timing_day_two}
                    </p>
                    <p className="text-md text-center font-thin italic ">
                        {content?.dinner_timing_hours_two}
                    </p>
                </div>
                <div className="flex justify-center pb-10">
                    <Button size="lg" className="text-center w-40 h-16 bg-black text-beige" nonce={undefined} onResize={undefined} onResizeCapture={undefined}>
                        Book Now
                    </Button>
                </div>
                <p className="text-md text-center ">
                    {content?.reservation_line_one}
                </p>
                <p className="text-md text-center">
                    {content?.reservation_line_two}
                </p>
                <a href={"tel:" + content?.phone}>
                    <p className="text-md text-center">
                        {content?.phone}
                    </p>
                </a>
                <a href={"mailto:" + content?.email}>
                    <p className="text-md text-center">
                        {content?.email}
                    </p>
                </a>
            </div>
        </>
    )
}