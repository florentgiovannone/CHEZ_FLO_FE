export default function NotLogged() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-6">
                <div className="text-center">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-4 sm:mb-6">
                        You are not logged in, please login before entering the user content
                    </h1>
                </div>
                <div className="flex justify-center">
                    <a href="/login" className="w-full sm:w-auto">
                        <button
                            onClick={() => {
                                window.location.href = "/login";
                            }}
                            className="w-full sm:w-80 h-12 sm:h-14 bg-black text-beige rounded-full font-medium text-base sm:text-lg hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                        >
                            Login
                        </button>
                    </a>
                </div>
            </div>
        </div>
    );
}