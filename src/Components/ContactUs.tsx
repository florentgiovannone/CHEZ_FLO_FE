import { FaDiamond } from "react-icons/fa6";
import Map from "../Assets/Images/Map.png"
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
                        In the heart of Southfield
                    </h2>
                    <p className="text-md text-center">139 Beaumont Road</p>
                    <p className="text-md text-center mb-10">London, SW19 6RY</p>
                    <div className="pb-10">
                        <p className="text-md text-center">+44 (0) 234 567 8910</p>
                        <p className="text-md text-center">reservations@chezflo.com</p>
                    </div>
                    <div>
                        <p className="text-md text-center">Monday-Friday ………… 07:30-23:00</p>
                        <p className="text-md text-center">Saturday ……………… 08:00-23:00</p>
                        <p className="text-md text-center">Sunday ……………… 08:00-18:00</p>
                    </div>
                </div>
                <div className=" md:w-1/3  md:pb-40 md:flex md:items-center md:justify-center">
                    <img
                        alt="Company Logo"
                        src={Map}
                        className="h-auto w-auto"
                    />
                </div>
            </div>


        </>
    )
}