import { IContent } from "../interfaces/content";

interface ContentProps {
    content: null | IContent;
    setContent: Function;
}

export default function EditMainPage({ content, setContent }: ContentProps) {

    return <>
        <div className="my-24 flex flex-col justify-center items-center">
            <div>
                <h1 className="text-3xl">Edit main page</h1>
            </div>
            <div className="m-10 grid grid-cols-2 gap-6 justify-center items-center md:grid-cols-4 xl:grid-cols-5">
                <div>
                    <a href={`/carouselsList/${content?.id}`} className="h-48 flex justify-center items-center  max-w-sm p-6 bg-white border rounded-lg bg-black text-beige hover:bg-opacity-50">
                        <h5 className="text-2xl font-bold text-center">Carousel</h5>
                    </a>
                </div>
                <div>
                    <a href={`/updateAbout/${content?.id}/about`} className="h-48 flex justify-center items-center  max-w-sm p-6 bg-white border rounded-lg bg-black text-beige hover:bg-opacity-50">
                        <h5 className="text-2xl font-bold text-center">About</h5>
                    </a>
                </div>
                <div>
                    <a href="updateMenus" className="h-48 flex justify-center items-center  max-w-sm p-6 bg-white border rounded-lg bg-black text-beige hover:bg-opacity-50">
                        <h5 className="text-2xl font-bold text-center">Menus</h5>
                    </a>
                </div>
                <div>
                    <a href="/updateReservation" className="h-48 flex justify-center items-center  max-w-sm p-6 bg-white border rounded-lg bg-black text-beige hover:bg-opacity-50">
                        <h5 className="text-2xl font-bold text-center">Reservation</h5>
                    </a>
                </div>
                <div>
                    <a href="updateContact" className="h-48 flex justify-center items-center  max-w-sm p-6 bg-white border rounded-lg bg-black text-beige hover:bg-opacity-50">
                        <h5 className="text-2xl font-bold text-center">Contact</h5>
                    </a>
                </div>
            </div>
        </div>
    </>
}