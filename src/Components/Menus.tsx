import { CgBorderStyleDotted } from "react-icons/cg";
import { FaDiamond } from "react-icons/fa6";
import { Button } from "@material-tailwind/react";
import { IContent } from "../interfaces/content";



interface ContentProps {
    content: null | IContent;
    setContent: Function;
}

export default function Menus({ content }: ContentProps) {
    const currentMenus = [
        { name: `${content?.breakfast_menus_text}`, href: `${content?.breakfast_menus_file}`, current: true},
        { name: `${content?.lunch_menus_text}`, href: `${content?.lunch_menus_file}`, current: false},
        { name: `${content?.dessert_menus_text}`, href: `${content?.dessert_menus_file}`, current: false},
        { name: `${content?.winelist_menus_text}`, href: `${content?.winelist_menus_file}`, current: false},
        { name: `${content?.cocktail_menus_text}`, href: `${content?.cocktail_menus_file}`, current: false},
    ]
    return (
        <>
        <span className='anchor' id='menus'></span>
            <div className="flex flex-col w-2/3 mx-auto pb-10">
                <h1 className=" text-md text-black text-center">Menus.</h1>
                <div className="m-5 flex justify-center items-center">
                    <FaDiamond className="text-sm"></FaDiamond>
                </div>
                {currentMenus.map((item, index) => (
                    <a key={index}
                        href={item.href}
                        aria-current={item.current ? 'page' : undefined}
                        className="pb-5 text-3xl text-black text-center font-black"
                        target="_blank">{item.name}</a>
                )
                )}
                
            </div>

        </>
    )
}