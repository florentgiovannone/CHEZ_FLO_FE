import { FaDiamond } from "react-icons/fa6";
import { Button } from "@material-tailwind/react";

export default function About() {
    return (
        <>
            <span className='anchor' id='about'></span>
            <div className="flex flex-col w-2/3 mx-auto pb-40">
                <h1 className=" text-md text-black text-center">About Us</h1>
                <div className="m-5 flex justify-center items-center">
                    <FaDiamond className="text-sm"></FaDiamond>
                </div>
                <h2 className="pb-5 text-3xl text-black text-center">
                    Welcome to Chez Flo
                </h2>
                <p className="text-md text-center mb-20">
                    A luxury brasserie where culinary artistry meets refined elegance. We craft a unique dining experience by blending classic techniques with modern innovation, using only the finest seasonal ingredients. Whether for an intimate evening or a celebratory feast, our impeccable service and sophisticated ambiance promise to elevate every moment. At Chez Flo, dining is more than a meal—it’s a journey of flavors, atmosphere, and unforgettable memories.
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