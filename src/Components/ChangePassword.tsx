import React, { useReducer, useState, SyntheticEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

interface ValidationState {
    currentPasswordValid: boolean;
    newPasswordValid: boolean;
    passwordCheck: {
        hasUppercase: boolean;
        hasLowercase: boolean;
        hasSpecialChar: boolean;
        hasNumber: boolean;
        hasValidLength: boolean;
    };
}

const initialValidationState: ValidationState = {
    currentPasswordValid: true,
    newPasswordValid: false,
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

export default function ChangePassword() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });

    const [validationState, dispatch] = useReducer(validationReducer, initialValidationState);
    const [message, setMessage] = useState("");
    const [passwordChanged, setPasswordChanged] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "new_password") validatePassword(value);
    };

    function validatePassword(password: string) {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasSpecialChar = /[!@#$%&*]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasValidLength = password.length >= 8 && password.length <= 20;

        const isPasswordValid = hasUppercase && hasLowercase && hasSpecialChar && hasNumber && hasValidLength;

        dispatch({
            newPasswordValid: isPasswordValid,
            passwordCheck: { hasUppercase, hasLowercase, hasSpecialChar, hasNumber, hasValidLength }
        });
    }

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();

        if (!validationState.newPasswordValid) {
            setMessage("Please ensure the new password meets all requirements.");
            return;
        }

        if (formData.new_password !== formData.confirm_password) {
            setMessage("New password and confirm password do not match.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const res = await axios.put(
                "/api/change-password",
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(res.data.message);
            setPasswordChanged(true);
        } catch (error: any) {
            setMessage(error.response?.data?.error || "Something went wrong");
            setPasswordChanged(false);
        }
    };

    return (
        <div className="section flex justify-center bg-gray-50 px-4 py-5 mt-10">
            <div className="container w-full ">
                <h1 className="text-3xl">Change Your Password</h1>

                <div className="field mt-4">
                    <input
                        className="w-full p-4 border border-gray-300 rounded-md"
                        placeholder="Current Password"
                        type="password"
                        name="current_password"
                        value={formData.current_password}
                        onChange={handleChange}
                    />
                </div>

                <div className="field mt-4">
                    <input
                        className="w-full p-4 border border-gray-300 rounded-md"
                        placeholder="New Password"
                        type="password"
                        name="new_password"
                        value={formData.new_password}
                        onChange={handleChange}
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
                            );
                        })}
                    </ul>
                </div>

                <div className="field mt-4">
                    <input
                        className="w-full p-4 border border-gray-300 rounded-md"
                        placeholder="Confirm New Password"
                        type="password"
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                    />
                </div>

                {message && <p className="text-red-600 mt-4">{message}</p>}

                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="mt-6 bg-black text-beige hover:bg-beige hover:text-black border border-black px-6 py-2 rounded-xl font-bold w-full"
                >
                    Change Password
                </button>
                {passwordChanged && (
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="mt-4 bg-black text-beige hover:bg-beige hover:text-black border border-black px-6 py-2 rounded-xl font-bold"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                )}
            </div>


        </div>
    );
}