import { IUser } from "../interfaces/users";
import NotLogged from "./NotLogged";

interface UserProps {
    user: null | IUser;
    setUser: Function;
}

export default function Dashboard({ user, setUser }: UserProps) {

    function logout() {
        localStorage.removeItem("token");
        setUser(null);
    }

    return <>
        {user ? (
            <div className="flex flex-col justify-center items-center px-4 py-8 md:my-24">
                <div className="text-center mb-8">
                    <h1 className="text-2xl md:text-3xl mb-2">DASHBOARD</h1>
                    <h2 className="text-xl md:text-2xl mb-6">Welcome {user?.firstname}</h2>
                    <div className="flex items-center justify-center mb-6">
                        {!user.image ? (
                            <figure className="w-24 md:w-32">
                                <img
                                    alt="Placeholder"
                                    src="https://cdn.pixabay.com/photo/2017/02/23/13/05/avatar-2092113_1280.png"
                                    className="rounded-full border-2 md:border-4 border-black"
                                />
                            </figure>
                        ) : (
                            <figure className="w-24 md:w-32">
                                <img
                                    className="rounded-full border-2 md:border-4 border-black"
                                    src={user.image}
                                    alt="Placeholder image"
                                />
                            </figure>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:gap-6 w-full max-w-6xl md:grid-cols-2 xl:grid-cols-3">
                    <div>
                        <a href="/EditMainPage" className=" h-32 md:h-48 flex justify-center items-center p-4 md:p-6 bg-black text-beige hover:bg-opacity-50 rounded-lg border transition-colors">
                            <h5 className="text-lg md:text-2xl font-bold text-center">Update Main page</h5>
                        </a>
                    </div>
                    <div>
                        <a href={`/updateaccount/${user.id}`} className=" h-32 md:h-48 flex justify-center items-center p-4 md:p-6 bg-black text-beige hover:bg-opacity-50 rounded-lg border transition-colors">
                            <h5 className="text-lg md:text-2xl font-bold text-center">Update my details</h5>
                        </a>
                    </div>
                    <div>
                        <a href="/changePassword" className=" h-32 md:h-48 flex justify-center items-center p-4 md:p-6 bg-black text-beige hover:bg-opacity-50 rounded-lg border transition-colors">
                            <h5 className="text-lg md:text-2xl font-bold text-center">Update my Password</h5>
                        </a>
                    </div>
                    <div>
                        <a href="/signup" className=" h-32 md:h-48 flex justify-center items-center p-4 md:p-6 bg-black text-beige hover:bg-opacity-50 rounded-lg border transition-colors">
                            <h5 className="text-lg md:text-2xl font-bold text-center">Create a new user</h5>
                        </a>
                    </div>
                    <div>
                        <a href="/userlist" className=" h-32 md:h-48 md:w-full flex justify-center items-center p-4 md:p-6 bg-black text-beige hover:bg-opacity-50 rounded-lg border transition-colors">
                            <h5 className="text-lg md:text-2xl font-bold text-center">Delete/Update a user</h5>
                        </a>
                    </div>
                </div>

                <div className="mt-8">
                    <a href="/">
                        <button
                            onClick={logout}
                            className="w-96 h-12 bg-black text-beige hover:bg-opacity-50 rounded-lg transition-colors">
                            Logout
                        </button>
                    </a>
                </div>
            </div>
        ) : (
            <NotLogged />
        )
        }
    </>
}