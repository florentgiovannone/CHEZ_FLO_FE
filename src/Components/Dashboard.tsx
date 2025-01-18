import { IUser } from "../interfaces/users";

interface DashboardProps {
    user: null | IUser;
    setUser: Function;
}

export default function Dashboard({ user, setUser }: DashboardProps) {

    function logout() {
        localStorage.removeItem("token");
        setUser(null);
    }

    return <>
    { user ? (
        <div className="my-24 flex flex-col justify-center items-center">
            <div className="mb-10">
                <h1 className="text-3xl">DASHBOARD</h1>
                <h1 className="text-2xl">Welcome {user?.firstname}</h1>
            </div>
            <div className="grid grid-cols-1 gap-6 justify-center items-center md:grid-cols-2">
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
                    <a href="#" className="h-48 flex justify-center items-center  max-w-sm p-6 bg-white border rounded-lg bg-black text-beige hover:bg-opacity-50">
                        <h5 className="text-2xl font-bold text-center">Update my details</h5>
                    </a>
                </div>
                <div>
                    <a href="#" className="h-48 flex justify-center items-center  max-w-sm p-6 bg-white border rounded-lg bg-black text-beige hover:bg-opacity-50">
                        <h5 className="text-2xl font-bold text-center">Create / Delete users</h5>
                    </a>
                </div>
                <div>
                    <a href="/">
                        <button
                            onClick={logout}
                            className="rounded-full w-96 h-12 bg-black text-beige">Logout
                        </button>
                    </a>
                </div>
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