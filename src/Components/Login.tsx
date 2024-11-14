import { Button } from "@material-tailwind/react";

export default function Login() {
    return (
        <>
            <div className="my-52 lg:my-32 flex flex-col justify-center items-center">
            <div className="mb-10">            
                <input placeholder="email" type="email" className=" form-input rounded-full w-96 h-12" />
            </div>
                <div className="mb-10">
                    <input placeholder="Password" type="password" className="form-input rounded-full w-96 h-12" />
            </div>
                <div>
                    <Button size="lg" className="rounded-full w-96 h-12 bg-black text-beige" nonce={undefined} onResize={undefined} onResizeCapture={undefined}>
                        Submit
                    </Button>
                </div>
        </div>
        </>
    )
}