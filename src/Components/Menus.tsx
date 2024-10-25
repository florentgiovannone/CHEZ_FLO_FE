import { CgBorderStyleDotted } from "react-icons/cg";
import { FaDiamond } from "react-icons/fa6";
import { Button } from "@material-tailwind/react";

const currentMenus = [
    { name: 'Breakfast', href: '#', current: true },
    { name: 'Lunch', href: '#', current: false },
    { name: 'Dinner', href: '#', current: false },
    { name: 'Winelist', href: '#', current: false },
    { name: 'Cocktail', href: '#', current: false },
]


export default function Menus() {
    return (
        <>
        <span className='anchor' id='menus'></span>
            <div className="flex flex-col w-2/3 mx-auto pb-40">
                <h1 className=" text-md text-black text-center">Menus.</h1>
                <div className="m-5 flex justify-center items-center">
                    <FaDiamond className="text-sm"></FaDiamond>
                </div>
                {currentMenus.map((item) => (
                    <a key={item.name}
                        href={item.href}
                        aria-current={item.current ? 'page' : undefined}
                        className="pb-5 text-3xl text-black text-center font-black">{item.name}</a>
                )
                )}
                
            </div>

        </>
    )
}