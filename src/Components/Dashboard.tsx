export default function ({}) {
    return <>
        <div className="my-24 flex flex-col justify-center items-center">
            <div className="mb-10">
            <h1 className="text-3xl">DASHBOARD</h1>
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
            </div>
    </div>
    </>
}