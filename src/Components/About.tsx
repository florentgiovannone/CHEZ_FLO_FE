import { FaDiamond } from "react-icons/fa6";
import { Button } from "@material-tailwind/react";
import { IContent } from "../interfaces/content";

interface ContentProps {
    content: null | IContent;
    setContent: Function;
}


export default function About({ content }: ContentProps) {
    return (
        <>
            <span className='anchor' id='about'></span>
            <div className="flex flex-col w-2/3 mx-auto pb-10">
                <h1 className=" text-md text-black text-center">About Us</h1>
                <div className="m-5 flex justify-center items-center">
                    <FaDiamond className="text-sm"></FaDiamond>
                </div>
                <h2 className="pb-5 text-3xl text-black text-center">
                    {content?.about_title}
                </h2>
                <p className="text-md text-center mb-20">
                    {content?.about_text}
                </p>
                <div className="flex justify-center">
                    <Button size="lg" className="text-center w-40 h-16 bg-black text-beige"  nonce={undefined} onResize={undefined} onResizeCapture={undefined}>
                        Book Now
                    </Button>
                </div>
            </div>

        </>
    )
}