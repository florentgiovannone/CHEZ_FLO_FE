import { FaDiamond } from "react-icons/fa6";
import { IMenus } from "../interfaces/menus";

interface MenusProps {
    menus: IMenus[];
    setContent: Function;
}

export default function Menus({ menus, setContent }: MenusProps) {
    const menuOrder = [
        "breakfast",
        "lunch",
        "dinner",
        "winelist",
        "cocktail",
        "desserts",
    ];

    const sortedMenus = [...menus].sort((a, b) => {
        const typeA = a.menus_type.toLowerCase();
        const typeB = b.menus_type.toLowerCase();
        const indexA = menuOrder.indexOf(typeA);
        const indexB = menuOrder.indexOf(typeB);

        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return typeA.localeCompare(typeB);
    });

    return (
        <>
            <span className="anchor" id="menus"></span>
            <div className="flex flex-col w-full max-w-screen-md mx-auto px-4 py-10">
                <h1 className="text-center text-lg sm:text-xl text-black">Menus.</h1>

                <div className="my-4 flex justify-center items-center">
                    <FaDiamond className="text-sm sm:text-base text-black" />
                </div>

                {sortedMenus?.map((item) => (
                    <div key={item.id} className="pb-6">
                        <a
                            href={item.menus_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                        >
                            <h2 className="text-center text-2xl sm:text-3xl text-black font-bold hover:underline">
                                {item.menus_text}
                            </h2>
                        </a>
                    </div>
                ))}
            </div>
        </>
    );
}