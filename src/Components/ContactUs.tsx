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
            <div className="md:flex px-10 h-screen">
                <div className="w-full pb-10  justify-center items-center md:flex-col md:flex md:w-1/2 md:pb-40">
                    <h1 className=" justify-around text-md text-black text-center">Contact</h1>
                    <div className="m-5 flex justify-center items-center">
                        <FaDiamond className="text-sm" />
                    </div>
                    <h2 className=" md:pb-5 text-3xl text-black text-center">
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
                <div className=" md:w-1/3  md:pb-40 md:flex md:items-center md:justify-center">
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