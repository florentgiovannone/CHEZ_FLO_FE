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
            <span className="anchor" id="about"></span>
            <div className="flex flex-col w-full max-w-screen-md mx-auto px-4 py-10">
                <h1 className="text-center text-sm sm:text-base text-black">About Us</h1>

                <div className="my-4 flex justify-center items-center">
                    <FaDiamond className="text-base sm:text-lg text-black" />
                </div>

                <h2 className="text-center text-2xl sm:text-3xl font-semibold text-black mb-4">
                    {content?.about_title}
                </h2>

                <p className="text-center text-sm sm:text-base text-gray-700 mb-10">
                    {content?.about_text}
                </p>

                <div className="flex justify-center">
                    <Button
                        size="lg"
                        className="w-40 h-14 sm:h-16 bg-black text-beige text-sm sm:text-base"
                        nonce={undefined}
                        onResize={undefined}
                        onResizeCapture={undefined}
                    >
                        Book Now
                    </Button>
                </div>
            </div>
        </>
    );
}