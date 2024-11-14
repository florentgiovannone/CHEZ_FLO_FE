import React from "react";
import { Button } from "@material-tailwind/react";

export default function Login() {
    const [green, setGreen] = React.useState(false);
    const [greenPassUpper, setGreenPassUpper] = React.useState(false);
    const [greenPassLower, setGreenPassLower] = React.useState(false);
    const [greenPassSpec, setGreenPassSpec] = React.useState(false);
    const [greenPassNum, setGreenPassNum] = React.useState(false);
    const [greenPassLength, setGreenPassLength] = React.useState(false);

    return (
        <>
            <div className="my-10 flex flex-col justify-center items-center">
            <div className="mb-10">            
                    <input aria-label="Enter your address" placeholder="email" type="email" className="text-left form-input rounded-full w-96 h-12" />
            </div>
            <div className="mb-10">            
                    <input aria-label="Enter your firstname" placeholder="Firstname" type="text" className=" form-input rounded-full w-96 h-12" />
            </div>
            <div className="mb-10">            
                    <input aria-label="Enter your lastname" placeholder="Lastname" type="text" className=" form-input rounded-full w-96 h-12" />
            </div>
                <div className="mb-10">
                    <input aria-label="Enter your password" placeholder="Password" type="password" className="form-input rounded-full w-96 h-12" />
            </div>
                <div className="mb-6">
                    <input aria-label="Confirm your password" placeholder="Password confirmation" type="password" className="form-input rounded-full w-96 h-12" />
            </div>
                <div className="mb-6 ml-10" >
                <p className="font-bold">Password need to have the below requirements:            </p>
                <ul>
                    {greenPassUpper && <li className="text-green">one uppercase</li>}
                    {!greenPassUpper && <li className="text-red"> X one uppercase</li>}
                    {greenPassLower && <li className="text-green">one lowerCase</li>}
                    {!greenPassLower && <li className="text-red"> X one lowerCase</li>}
                    {greenPassSpec && <li className="text-green">one special character</li>}
                    {!greenPassSpec && <li className="text-red"> X one special character</li>}
                    {greenPassNum && <li className="text-green">one digit</li>}
                    {!greenPassNum && <li className="text-red"> X one digit</li>}
                    {greenPassLength && <li className="text-green">Be between 8 and 20 character long</li>}
                    {!greenPassLength && <li className="text-red"> X Be between 8 and 20 character long</li>}
                </ul>
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