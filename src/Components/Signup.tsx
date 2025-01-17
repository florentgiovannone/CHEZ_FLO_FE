import React, { useReducer, useState, SyntheticEvent, useEffect }  from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { IUser } from "../interfaces/users";
import { baseUrl } from "../config";
import { Button } from "@material-tailwind/react";

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

function validationReducer(state: ValidationState, action: Partial<ValidationState>
): ValidationState {
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
        password_confirmation: ""
    })

    const [errorData, setErrorData] = useState<string | null>(null);
    const [usernameMessage, setUsernameMessage] = useState(" ");
    const [existingUsers, setExistingUsers] = useState<IUser[] | null>(null);
    const [validationState, dispatch] = useReducer(validationReducer, initialValidationState);

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

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (name == "username") validateUsername(value);
        if (name == "password") validatePassword(value);

    }

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

    // function handleUpload() {
    //     window.cloudinary
    //         .createUploadWidget(
    //             {
    //                 cloudName: "ded4jhx7i",
    //                 uploadPreset: "Codestream",
    //                 cropping: true,
    //                 croppingAspectRatio: 1
    //             },
    //             (err: any, result: { event: string; info: { secure_url: any; }; }) => {
    //                 if (result.event !== "success") {
    //                     return;
    //                 }
    //                 setFormData({
    //                     ...formData,
    //                     image: result.info.secure_url,
    //                 });
    //             }
    //         )
    //         .open();
    // }


    return (
        <>
            <div className="section">
                <div className="container">

                    {/* Username */}
                    <div className="field mt-4">
                        <label className="label">Username <span className="has-text-danger">*</span></label>
                        <div className="control">
                            <input
                                className="input has-border-green "
                                placeholder="Username"
                                type="text"
                                name={'username'}
                                onChange={handleChange}
                                value={formData.username}
                            />
                            {usernameMessage && (
                                <small className={validationState.passwordCheck ? "has-text-success" : "has-text-danger"}></small>
                            )}
                        </div>
                    </div>

                    {/* Firstame */}
                    <div className="field mt-4">
                        <label className="label">Firstname <span className="has-text-danger">*</span></label>
                        <div className="control">
                            <input
                                className="input has-border-green "
                                placeholder="Firstname"
                                type="text"
                                name={'firstname'}
                                onChange={handleChange}
                                value={formData.firstname}
                            />
                        </div>
                    </div>

                    {/* Last Name */}
                    <div className="field  mt-4">
                        <label className="label">Lastname <span className="has-text-danger">*</span></label>
                        <div className="control">
                            <input
                                className="input has-border-green "
                                placeholder="Lastname"
                                type="text"
                                name={'lastname'}
                                onChange={handleChange}
                                value={formData.lastname}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="field  mt-4">
                        <label className="label">Email <span className="has-text-danger">*</span></label>
                        <div className="control">
                            <input
                                className="input has-border-green "
                                placeholder="Email"
                                type="text"
                                name={'email'}
                                onChange={handleChange}
                                value={formData.email}
                            />
                        </div>
                    </div>

                    {/* Image */}
                    {/* <div className="field  mt-4">
                        <div>
                            <div className="container">
                                <button className="button mb-3" onClick={handleUpload}>Click to upload an image</button>
                                <textarea
                                    className="textarea has-border-green"
                                    placeholder='Image URL'
                                    onChange={handleChange}
                                    name={'image'}
                                    value={formData.image} />
                            </div>

                            <div>
                            </div>

                        </div>
                    </div> */}

                    {/* Password */}
                    <div className="field  mt-4">
                        <label className="label">Password <span className="has-text-danger">*</span></label>
                        <div className="control">
                            <input
                                className="input has-border-green "
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
                    </div>

                    {/* Confirm Password */}
                    <div className="field  mt-4">
                        <label className="label">Confirm password <span className="has-text-danger">*</span></label>
                        <div className="control">
                            <input
                                className="input has-border-green "
                                placeholder="Confirm password"
                                type="password"
                                name={'password_confirmation'}
                                onChange={handleChange}
                                value={formData.password_confirmation}
                            />
                            {errorData && <p className="has-text-danger">{errorData}</p>}
                        </div>
                    </div>

                    {/* Submit button */}
                    <button
                        className="button has-border-green mt-4" onClick={handleSubmit}>Submit
                    </button>
                </div>
            </div>
        </>
    )
}