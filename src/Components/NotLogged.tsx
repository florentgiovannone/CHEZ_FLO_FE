export default function NotLogged() {
    return (
        <div className="m-28">
            <div className="mb-10">
                <h1 className="text-3xl">You are not loged in, please login before entering the user content</h1>
            </div>
            <div>
                <a href="/login">
                    <button
                        onClick={() => {
                            window.location.href = "/login";
                        }}
                        className="rounded-full w-96 h-12 bg-black text-beige">Login
                    </button>
                </a>
            </div>
        </div>
    );
}