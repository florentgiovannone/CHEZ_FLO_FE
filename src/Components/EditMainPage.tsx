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
    return (
        user ? (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-black text-center">
                            Edit Main Page
                        </h1>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            <a
                                href={`/updateCarousels/${content?.id}`}
                                className="block bg-black text-beige hover:bg-beige hover:text-black border border-beige hover:border-black rounded-lg p-6 sm:p-8 transition-colors group"
                            >
                                <div className="flex flex-col items-center justify-center h-32 sm:h-40">
                                    <h5 className="text-lg sm:text-xl md:text-2xl font-bold text-center">
                                        Carousel
                                    </h5>
                                </div>
                            </a>

                            <a
                                href={`/updateAbout/${content?.id}`}
                                className="block bg-black text-beige hover:bg-beige hover:text-black border border-beige hover:border-black rounded-lg p-6 sm:p-8 transition-colors group"
                            >
                                <div className="flex flex-col items-center justify-center h-32 sm:h-40">
                                    <h5 className="text-lg sm:text-xl md:text-2xl font-bold text-center">
                                        About
                                    </h5>
                                </div>
                            </a>

                            <a
                                href={`/updateMenus/${content?.id}`}
                                className="block bg-black text-beige hover:bg-beige hover:text-black border border-beige hover:border-black rounded-lg p-6 sm:p-8 transition-colors group"
                            >
                                <div className="flex flex-col items-center justify-center h-32 sm:h-40">
                                    <h5 className="text-lg sm:text-xl md:text-2xl font-bold text-center">
                                        Menus
                                    </h5>
                                </div>
                            </a>

                            <a
                                href={`/updateGrid/${content?.id}`}
                                className="block bg-black text-beige hover:bg-beige hover:text-black border border-beige hover:border-black rounded-lg p-6 sm:p-8 transition-colors group"
                            >
                                <div className="flex flex-col items-center justify-center h-32 sm:h-40">
                                    <h5 className="text-lg sm:text-xl md:text-2xl font-bold text-center">
                                        Grid Gallery
                                    </h5>
                                </div>
                            </a>

                            <a
                                href={`/updateReservation/${content?.id}`}
                                className="block bg-black text-beige hover:bg-beige hover:text-black border border-beige hover:border-black rounded-lg p-6 sm:p-8 transition-colors group"
                            >
                                <div className="flex flex-col items-center justify-center h-32 sm:h-40">
                                    <h5 className="text-lg sm:text-xl md:text-2xl font-bold text-center">
                                        Reservation
                                    </h5>
                                </div>
                            </a>

                            <a
                                href={`/updateContact/${content?.id}`}
                                className="block bg-black text-beige hover:bg-beige hover:text-black border border-beige hover:border-black rounded-lg p-6 sm:p-8 transition-colors group"
                            >
                                <div className="flex flex-col items-center justify-center h-32 sm:h-40">
                                    <h5 className="text-lg sm:text-xl md:text-2xl font-bold text-center">
                                        Contact Us
                                    </h5>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <NotLogged />
        )
    );
}