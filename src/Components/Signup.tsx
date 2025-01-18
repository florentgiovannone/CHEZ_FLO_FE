import React, { useReducer, useState, SyntheticEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { IUser } from "../interfaces/users";
import { baseUrl } from "../config";

interface ValidationState {
    usernameValid: boolean;
    passwordValid: boolean;
    passwordCheck: {
        hasUppercase: boolean;
        hasLowercase: boolean;
        hasSpecialChar: boolean;
        hasNumber: boolean;
        hasValidLength: boolean;
    };
}

const initialValidationState: ValidationState = {
    usernameValid: false,
    passwordValid: false,
    passwordCheck: {
        hasUppercase: false,
        hasLowercase: false,
        hasSpecialChar: false,
        hasNumber: false,
        hasValidLength: false,
    },
};

function validationReducer(state: ValidationState, action: Partial<ValidationState>): ValidationState {
    return { ...state, ...action }
}

export default function Signup() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState<Omit<IUser, "id"> & { password: string; password_confirmation: string }>({
        email: "",
        firstname: "",
        lastname: "",
        username: "",
        password: "",
        password_confirmation: "",
        image: ""
    })
    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (name == "username") validateUsername(value);
        if (name == "password") validatePassword(value);
    }
    function handleUpload() {
        window.cloudinary
            .createUploadWidget(
                {
                    cloudName: "ded4jhx7i",
                    uploadPreset: "Codestream",
                    cropping: true,
                    croppingAspectRatio: 1
                },
                (err: any, result: { event: string; info: { secure_url: any; }; }) => {
                    if (result.event !== "success") {
                        return;
                    }
                    setFormData({
                        ...formData,
                        image: result.info.secure_url,
                    });
                }
            )
            .open();
    }

    const [errorData, setErrorData] = useState<string | null>(null);
    async function handleSubmit(e: SyntheticEvent) {
        e.preventDefault();
        if (validationState.usernameValid || !validationState.passwordValid) {
            setErrorData("Please ensure all field are valid");
            return;
        }
        if (formData.password !== formData.password_confirmation) {
            setErrorData("Password do not match");
            return;
        }
        try {
            const response = await axios.post<IUser>(`${baseUrl}/signup`, formData)
            console.log(response.data)
            navigate('/login')
        } catch (e: any) {
            setErrorData(e.response.data.error)
        }
    }

    const [existingUsers, setExistingUsers] = useState<IUser[] | null>(null);
    const [usernameMessage, setUsernameMessage] = useState(" ");
    function validateUsername(username: string) {
        if (!existingUsers) return;
        const isExistingUser = existingUsers.some((user) => user.username === username);
        if (isExistingUser) {
            setUsernameMessage("The username already exist")
            dispatch({ usernameValid: false })
        } else {
            setUsernameMessage("You can use this username")
            dispatch({ usernameValid: true })
        }
    }

    const [validationState, dispatch] = useReducer(validationReducer, initialValidationState);
    function validatePassword(password: string) {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasSpecialChar = /[!@#$%&*]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasValidLength = password.length >= 8 && password.length <= 20;

        const isPasswordValid = hasUppercase && hasLowercase && hasSpecialChar && hasNumber && hasValidLength;
        dispatch({
            passwordValid: isPasswordValid,
            passwordCheck: {
                hasUppercase, hasLowercase, hasSpecialChar, hasNumber, hasValidLength
            },
        });
    }

    useEffect(function fetchUsers() {
        async function getUsers() {
            try {
                const resp = await axios.get<IUser[]>(`${baseUrl}/users`)
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }
        getUsers()
    }, [])

    return (
        <>
            <div className="section flex items-center justify-center min-h-screen bg-gray-50 px-4 py-5">
                <div className="container w-full ">
                    <h1 className="text-3xl">Create a new user</h1>
                    <div className="field mt-4">
                        <input
                            className="w-full p-4 border border-gray-300 rounded-md"
                            placeholder="Username"
                            type="text"
                            name="username"
                            onChange={handleChange}
                            value={formData.username}
                        />
                    </div>
                    <div className="field mt-4">
                        <input
                            className="w-full p-4 border border-gray-300 rounded-md"
                            placeholder="Firstname"
                            type="text"
                            name="firstname"
                            onChange={handleChange}
                            value={formData.firstname}
                        />
                    </div>
                    <div className="field mt-4">
                        <input
                            className="w-full p-4 border border-gray-300 rounded-md"
                            placeholder="Lastname"
                            type="text"
                            name="lastname"
                            onChange={handleChange}
                            value={formData.lastname}
                        />
                    </div>
                    <div className="field mt-4">
                        <input
                            className="w-full p-4 border border-gray-300 rounded-md"
                            placeholder="Email"
                            type="text"
                            name="email"
                            onChange={handleChange}
                            value={formData.email}
                        />
                    </div>
                    <div className="my-4">
                        <div className="flex flex-col gap-4">
                            <button
                                className="rounded-full w-full sm:w-96 h-12 bg-black text-beige hover:bg-opacity-50"
                                onClick={handleUpload}
                            >
                                Click to upload an image
                            </button>
                            <textarea
                                placeholder="Image URL"
                                onChange={handleChange}
                                name="image"
                                value={formData.image}
                                className="w-full p-4 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>
                    <div className="field  mt-4">
                        <input
                            className="w-full p-4 border border-gray-300 rounded-md"
                            placeholder="Password"
                            type="password"
                            name={'password'}
                            onChange={handleChange}
                            value={formData.password}
                        />
                        <ul>
                            {Object.entries(validationState.passwordCheck).map(([check, passed]) => {
                                const checkMessage: Record<string, string> = {
                                    hasUppercase: "One uppercase letter",
                                    hasLowercase: "One lowercase letter",
                                    hasSpecialChar: "One special character (e.g., !@#$%)",
                                    hasNumber: "One number",
                                    hasValidLength: "Password must be between 8 and 20 characters",
                                };
                                return (
                                    <li key={check} className={passed ? "has-text-success" : "has-text-danger"}>
                                        {passed ? "✅" : "❌"} {checkMessage[check]}
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className="field  mt-4">
                        <input
                            className="w-full p-4 border border-gray-300 rounded-md"
                            placeholder="Confirm password"
                            type="password"
                            name={'password_confirmation'}
                            onChange={handleChange}
                            value={formData.password_confirmation}
                        />
                        {errorData && <p className="has-text-danger">{errorData}</p>}
                    </div>
                    <button
                        className="button has-border-green mt-4" onClick={handleSubmit}>Submit
                    </button>
                </div>
            </div>
        </>
    )
}