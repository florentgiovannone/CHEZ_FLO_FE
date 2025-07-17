import { FaDiamond } from "react-icons/fa6";
import { IContent } from "../interfaces/content";

interface ContentProps {
    content: null | IContent;
    setContent: Function;
}

export default function ContactUs({ content }: ContentProps) {
    return (
        <>
            <span className='anchor' id='contact'></span>
            <div className="flex flex-col md:flex-row px-10">
                <div className="w-full pb-10 flex flex-col justify-center items-center md:w-1/2 md:pb-40">
                    <h1 className="text-md text-black text-center">Contact</h1>
                    <div className="m-5 flex justify-center items-center">
                        <FaDiamond className="text-sm" />
                    </div>
                    <h2 className="text-3xl text-black text-center md:pb-5">
                        {content?.contact_title}
                    </h2>
                    <p className="text-md text-center">{content?.contact_adress_one}</p>
                    <p className="text-md text-center mb-10">{content?.contact_adress_two}</p>
                    <div className="pb-10">
                        <p className="text-md text-center">{content?.phone}</p>
                        <p className="text-md text-center">{content?.email}</p>
                    </div>
                    <div>
                        <p className="text-md text-center font-extrabold">{content?.contact_opening_day_one}</p>
                        <p className="text-md text-center font-thin italic pb-3">{content?.contact_opening_hours_one}</p>
                        <p className="text-md text-center font-extrabold">{content?.contact_opening_day_two}</p>
                        <p className="text-md text-center font-thin italic pb-3">{content?.contact_opening_hours_two}</p>
                        <p className="text-md text-center font-extrabold">{content?.contact_opening_day_three}</p>
                        <p className="text-md text-center font-thin italic pb-3">{content?.contact_opening_hours_three}</p>
                    </div>
                </div>
                <div className="w-full mb-10 flex justify-center items-center md:w-1/2 md:pb-40">
                    <img
                        alt="Company Logo"
                        src={`${content?.map}`}
                        className="h-auto w-auto"
                    />
                </div>
            </div>
        </>
    )
}