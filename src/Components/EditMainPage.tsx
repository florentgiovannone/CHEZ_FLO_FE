import { IContent } from "../interfaces/content";
import { IUser } from "../interfaces/users";
import NotLogged from "./NotLogged";

interface ContentProps {
    content: null | IContent;
    setContent: Function;
    setUser: Function;
}

interface UserProps {
    user: null | IUser;
    setUser: Function;
}

export default function EditMainPage({ content, setContent, user, setUser }: ContentProps & UserProps) {
    console.log(user)
    return  <>
        {(user ? <div className="my-24 flex flex-col justify-center items-center">
            <div>
                <h1 className="text-3xl">Edit main page</h1>
            </div>
            <div className="m-10 grid grid-cols-2 gap-6 justify-center items-center md:grid-cols-4 xl:grid-cols-5">
                <div>
                    <a href={`/updateCarousels/${content?.id}`} className="h-48 flex justify-center items-center  max-w-sm p-6 bg-white border rounded-lg bg-black text-beige hover:bg-opacity-50">
                        <h5 className="text-2xl font-bold text-center">Carousel</h5>
                    </a>
                </div>
                <div>
                    <a href={`/updateAbout/${content?.id}`} className="h-48 flex justify-center items-center  max-w-sm p-6 bg-white border rounded-lg bg-black text-beige hover:bg-opacity-50">
                        <h5 className="text-2xl font-bold text-center">About</h5>
                    </a>
                </div>
                <div>
                    <a href={`/updateMenus/${content?.id}`} className="h-48 flex justify-center items-center  max-w-sm p-6 bg-white border rounded-lg bg-black text-beige hover:bg-opacity-50">
                        <h5 className="text-2xl font-bold text-center">Menus</h5>
                    </a>
                </div>
                <div>
                    <a href={`/updateGrid/${content?.id}`} className="h-48 flex justify-center items-center  max-w-sm p-6 bg-white border rounded-lg bg-black text-beige hover:bg-opacity-50">
                        <h5 className="text-2xl font-bold text-center">Grid Gallery</h5>
                    </a>
                </div>
                <div>
                    <a href={`/updateReservation/${content?.id}`} className="h-48 flex justify-center items-center  max-w-sm p-6 bg-white border rounded-lg bg-black text-beige hover:bg-opacity-50">
                        <h5 className="text-2xl font-bold text-center">Reservation</h5>
                    </a>
                </div>
                <div>
                    <a href={`/updateContact/${content?.id}`} className="h-48 flex justify-center items-center  max-w-sm p-6 bg-white border rounded-lg bg-black text-beige hover:bg-opacity-50">
                        <h5 className="text-2xl font-bold text-center">Contact us section</h5>
                    </a>
                </div>
            </div>
        </div> : <NotLogged />
    )}
    </>
}