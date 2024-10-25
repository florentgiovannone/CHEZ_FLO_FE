import { FaDiamond } from "react-icons/fa6";
import { Button } from "@material-tailwind/react";

export default function Reservation() {
    return (
        <>
            <span className='anchor' id='reservation'></span>
            <div className="flex flex-col w-2/3 mx-auto pb-40">
            
                <h1 className=" text-3xl text-black text-center pb-5">Make a reservation</h1>
                <p className="text-md text-center">
                    We have outdoor seating available between noon and 4pm, which can be booked, or requested on arrival.
                </p>
                <div className="m-5 flex justify-center items-center">
                    <FaDiamond className="text-sm"></FaDiamond>
                </div>
                <div className="pb-10">
                    <h5 className=" text-3xl text-black text-center pb-5">Breakfast</h5>
                    <p className="text-md text-center">
                        Monday-Friday ……… 07.30-11.00
                    </p>
                    <p className="text-md text-center">
                        Saturday-Sunday …… 08.00-11.00
                    </p>
                </div>
                <div className="pb-10">
                    <h5 className=" text-3xl text-black text-center pb-5">Lunch</h5>
                <p className="text-md text-center">
                    Monday-Saturday ……… 11.45-16.45
                </p>
                <p className="text-md text-center">
                    Sunday …… 11.45-16.45
                    </p>
                </div>
                <div className="pb-10">
                    <h5 className=" text-3xl text-black text-center pb-5">Dinner</h5>
                <p className="text-md text-center">
                    Monday-Saturday ……… 17.00-22.15 (last reservation at 22.00)
                </p>
                <p className="text-md text-center">
                    Sunday - Lunch menu will be available until 19.00 (last reservation at 17.00)
                </p>
                </div>
                <div className="flex justify-center pb-10">
                    <Button size="lg" className="text-center w-40 h-16 bg-black text-beige" nonce={undefined} onResize={undefined} onResizeCapture={undefined}>
                        Book Now
                    </Button>
                </div>
                <p className="text-md text-center ">
                    No availability for your required number of guests?
                </p>
                <p className="text-md text-center">
                    Call us to discuss your booking.
                </p>
                <p className="text-md text-center">
                    +44 (0) 234 567 8910
                </p>
                <p className="text-md text-center">
                    reservations@chezflo.com
                </p>
            </div>

        </>
    )
}