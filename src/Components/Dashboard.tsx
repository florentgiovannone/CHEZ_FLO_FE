import { IUser } from "../interfaces/users";

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
    { user ? (
        <div className="my-24 flex flex-col justify-center items-center">
            <div>
                <h1 className="text-3xl">DASHBOARD</h1>
                <h1 className="text-2xl">Welcome {user?.firstname}</h1>
                    <div className="mt-5 flex items-center justify-center h-full">
                        {!user.image ? (
                            <figure className="w-32 ">
                                <img
                                    alt="Placeholder"
                                    src="https://cdn.pixabay.com/photo/2017/02/23/13/05/avatar-2092113_1280.png"
                                />
                            </figure>
                        ) : (
                            <figure className="w-32 ">
                                <img
                                        className="rounded-full border-4 border-black"
                                    src={user.image}
                                    alt="Placeholder image"
                                />
                            </figure>
                        )}
                    </div>
            </div>
                <div className="m-10 grid grid-cols-1 gap-6 justify-center items-center md:grid-cols-2 xl:grid-cols-3">
                <div>
                    <a href="#" className="h-48 flex justify-center items-center  max-w-sm p-6 bg-white border rounded-lg bg-black text-beige hover:bg-opacity-50">
                        <h5 className="text-2xl font-bold text-center">Update Main page</h5>
                    </a>
                </div>
                <div>
                    <a href="#" className="h-48 flex justify-center items-center  max-w-sm p-6 bg-white border rounded-lg bg-black text-beige hover:bg-opacity-50">
                        <h5 className="text-2xl font-bold text-center">Update Blog</h5>
                    </a>
                </div>
                <div>
                    <a href={`/updateaccount/${user.id}` }className="h-48 flex justify-center items-center  max-w-sm p-6 bg-white border rounded-lg bg-black text-beige hover:bg-opacity-50">
                        <h5 className="text-2xl font-bold text-center">Update my details</h5>
                    </a>
                </div>
                <div>
                    <a href="#" className="h-48 flex justify-center items-center  max-w-sm p-6 bg-white border rounded-lg bg-black text-beige hover:bg-opacity-50">
                            <h5 className="text-2xl font-bold text-center">Update my Password</h5>
                    </a>
                </div>
                <div>
                    <a href={`/signup` }className="h-48 flex justify-center items-center  max-w-sm p-6 bg-white border rounded-lg bg-black text-beige hover:bg-opacity-50">
                            <h5 className="text-2xl font-bold text-center">Create a new user</h5>
                    </a>
                </div>
                <div>
                    <a href="#" className="h-48 flex justify-center items-center  max-w-sm p-6 bg-white border rounded-lg bg-black text-beige hover:bg-opacity-50">
                        <h5 className="text-2xl font-bold text-center">Delete a user</h5>
                    </a>
                </div>
                    
            </div>
                <div>
                    <a href="/" >
                        <button
                            onClick={logout}
                            className="rounded-full w-96 h-12 bg-black text-beige hover:bg-opacity-50">Logout
                        </button>
                    </a>
                </div>
        </div>
        ) : (
                <div className="m-28">
                    <div className="mb-10">
                    <h1 className="text-3xl">You are not loged in, please login before entering the dashboard</h1>
                </div>
                    <div>
                        <a href="/login">
                            <button
                                onClick={logout}
                                className="rounded-full w-96 h-12 bg-black text-beige">Login
                            </button>
                        </a>
                    </div>
            </div>
        ) 
    }
    </>
}