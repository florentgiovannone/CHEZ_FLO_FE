import { ChangeEvent, SyntheticEvent, useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { IUser } from "../interfaces/users";
import { baseUrl } from "../config";

interface LoginProps {
    user: null | IUser;
    fetchUser: Function;
}

export default function Login({ user, fetchUser }: LoginProps) {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }
console.log(formData);

    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState("")

    async function handleSubmit(e: SyntheticEvent) {
        e.preventDefault();
        try {
            const resp = await axios.post(`${baseUrl}/login`, formData);
            localStorage.setItem('token', resp.data.token);
            await fetchUser();
            navigate('/dashboard');
            console.log(resp.data);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setErrorMessage(error.response.data.error || "An unexpected error occured1")
            } else {
                console.error("Error during login", error);
                setErrorMessage("An unexpected error occured2");
            }
        }
    }

    return (
        <>{ !user ? (
            <div className="my-52 lg:my-32 flex flex-col justify-center items-center">
                <form onSubmit={handleSubmit}>
                    <div className="mb-10">
                        <input  
                        className=" form-input rounded-full w-96 h-12"
                        placeholder="Username"
                        type="text"
                        name={'username'}
                        onChange={handleChange}
                        value={formData.username} />
                    </div>
                    <div className="mb-10">
                        <input 
                        className="form-input rounded-full w-96 h-12"
                        placeholder="Password"
                        type="password"
                        name={'password'}
                        onChange={handleChange}
                        value={formData.password}
                        />
                    </div>
                    {errorMessage && <small className="has-text-danger">{errorMessage}</small>}
                    <div>
                        <button className="rounded-full w-96 h-12 bg-black text-beige">Submit</button>
                    </div>


                </form>
                
        </div> ) : (
                <div className="m-28">
                    <div className="mb-10">
                        <h1 className="text-3xl">You are already loged in, please enter the dashboard</h1>
                    </div>
                    <div>
                        <a href="/dashboard">
                            <button
                                className="rounded-full w-96 h-12 bg-black text-beige">To Dashboard
                            </button>
                        </a>
                    </div>
                </div>
        )
        }
        </>
    )
}