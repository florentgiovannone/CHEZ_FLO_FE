import React, { SyntheticEvent, useState } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { baseUrl } from "../config";
import NotLogged from "./NotLogged";
import { IUser } from "../interfaces/users";

interface UserProps {
    user: null | IUser;
    setUser: Function;
}

export default function updateAccount({ user, setUser }: UserProps) {

    const { userId } = useParams()
    const navigate = useNavigate()

    React.useEffect(() => {
        async function fetchUser() {
            const token = localStorage.getItem('token')
            const resp = await axios.get(`${baseUrl}/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setFormData(resp.data)
        }
        fetchUser()
    }, [])

    const [formData, setFormData] = useState({
        email: "",
        firstname: "",
        lastname: "",
        username: "",
        image: ""
    })
    const [uploadButton, setUploadButton] = useState(false);

    function handleChange(e: any) {
        const fieldName = e.target.name
        const newFormData = structuredClone(formData)
        newFormData[fieldName as keyof typeof formData] = e.target.value
        setFormData(newFormData)
    }

    async function handleSubmit(e: SyntheticEvent) {
        e.preventDefault()
        const token = localStorage.getItem('token')
        const resp = await axios.put(`${baseUrl}/user/${userId}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        navigate(`/dashboard`)
        window.location.reload();
    }

    async function saveImage(e: SyntheticEvent) {
        e.preventDefault()
        const token = localStorage.getItem('token')
        const resp = await axios.put(`${baseUrl}/user/${userId}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    function handleUpload(e: SyntheticEvent, field: string) {
        e.preventDefault();
        if (!window.cloudinary) {
            console.error('Cloudinary widget not loaded');
            return;
        }

        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: "ded4jhx7i",
                uploadPreset: "chezflo",
                multiple: false,
                maxFiles: 1,
                resourceType: "image",
                clientAllowedFormats: ["jpg", "jpeg"],
                allowedFormats: ["jpg", "jpeg"],
                cropping: true,
                croppingAspectRatio: 1,
                croppingCoordinatesMode: "custom",
                showSkipCropButton: false,
                folder: "chez_flo_users",
                styles: {
                    palette: {
                        window: "#E6DBC6",
                        sourceBg: "#E6DBC6",
                        windowBorder: "#2F2C29",
                        tabIcon: "#2F2C29",
                        inactiveTabIcon: "#2F2C29",
                        menuIcons: "#E6DBC6",
                        link: "#2F2C29",
                        action: "#2F2C29",
                        inProgress: "#2F2C29",
                        complete: "#2F2C29",
                        error: "#FF0000",
                        textDark: "#2F2C29",
                    },
                },
            },
            (error: any, result: { event: string; info: any }) => {
                if (error) {
                    console.error("Cloudinary Upload Error:", error);
                    return;
                }

                if (result && result.event === "success") {
                    console.log("Upload result:", result);

                    const { public_id, version, format, coordinates } = result.info;

                    // If crop coordinates exist, apply them to build a cropped URL
                    let finalUrl = result.info.secure_url;

                    if (coordinates?.custom?.length > 0) {
                        const [x, y, width, height] = coordinates.custom[0];
                        finalUrl = `https://res.cloudinary.com/ded4jhx7i/image/upload/c_crop,x_${x},y_${y},w_${width},h_${height}/v${version}/${public_id}.${format}`;
                    }

                    // Set cropped image URL in form
                    setFormData(prev => ({
                        ...prev,
                        [field]: finalUrl,
                    }));
                    setUploadButton(true);
                }
            }
        );

        widget.open();
    }

    return (
        user ? (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-black">
                            Update Your Account Details
                        </h1>

                        <form className="space-y-6">
                            {/* Username */}
                            <div className="space-y-2">
                                <label className="text-sm sm:text-base font-semibold text-black">
                                    Username
                                </label>
                                <input
                                    className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                                    placeholder="Enter your username"
                                    type="text"
                                    name="username"
                                    onChange={handleChange}
                                    value={formData.username}
                                />
                            </div>

                            {/* Name Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm sm:text-base font-semibold text-black">
                                        First Name
                                    </label>
                                    <input
                                        className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                                        placeholder="Enter your first name"
                                        type="text"
                                        name="firstname"
                                        onChange={handleChange}
                                        value={formData.firstname}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm sm:text-base font-semibold text-black">
                                        Last Name
                                    </label>
                                    <input
                                        className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                                        placeholder="Enter your last name"
                                        type="text"
                                        name="lastname"
                                        onChange={handleChange}
                                        value={formData.lastname}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm sm:text-base font-semibold text-black">
                                    Email Address
                                </label>
                                <input
                                    className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                                    placeholder="Enter your email address"
                                    type="email"
                                    name="email"
                                    onChange={handleChange}
                                    value={formData.email}
                                />
                            </div>

                            {/* Profile Image Section */}
                            <div className="space-y-4">
                                <h2 className="text-lg sm:text-xl font-semibold text-black border-b border-gray-200 pb-2">
                                    Profile Image
                                </h2>
                                <div className="bg-black text-beige p-4 sm:p-6 rounded-xl">
                                    <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4 sm:gap-6 items-center">
                                        {/* Image Preview */}
                                        <div className="flex justify-center">
                                            {!formData.image ? (
                                                <figure className="flex justify-center">
                                                    <img
                                                        className="rounded-full w-24 h-24 sm:w-32 sm:h-32 object-cover border-4 border-beige"
                                                        alt="Default profile"
                                                        src="https://cdn.pixabay.com/photo/2017/02/23/13/05/avatar-2092113_1280.png"
                                                    />
                                                </figure>
                                            ) : (
                                                <figure className="flex justify-center">
                                                    <img
                                                        className="rounded-full border-4 border-beige w-24 h-24 sm:w-32 sm:h-32 object-cover"
                                                        src={formData.image}
                                                        alt="Profile image"
                                                    />
                                                </figure>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="space-y-3 flex items-center justify-center lg:justify-start">
                                            {!uploadButton && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <button
                                                        type="button"
                                                        className="w-full bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-3 px-4 rounded-lg text-sm sm:text-base transition-colors"
                                                        onClick={(e) => handleUpload(e, "image")}
                                                    >
                                                        Update Image
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="w-full bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-3 px-4 rounded-lg text-sm sm:text-base transition-colors"
                                                        onClick={() => setFormData({
                                                            ...formData,
                                                            image: ""
                                                        })}
                                                    >
                                                        Delete Image
                                                    </button>
                                                </div>
                                            )}
                                            {uploadButton && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <button
                                                        type="button"
                                                        className="w-full bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-3 px-4 rounded-lg text-sm sm:text-base transition-colors"
                                                        onClick={(e) => {
                                                            saveImage(e);
                                                            setUploadButton(false);
                                                        }}
                                                    >
                                                        Save Image
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="w-full bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-3 px-4 rounded-lg text-sm sm:text-base transition-colors"
                                                        onClick={() => {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                image: ""
                                                            }));
                                                            setUploadButton(false);
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Update Button */}
                            <div className="pt-4">
                                <button
                                    onClick={handleSubmit}
                                    className="w-full bg-black hover:bg-gray-800 text-beige hover:text-beige border border-black hover:border-gray-800 font-bold py-3 px-6 rounded-lg text-sm sm:text-base transition-colors"
                                >
                                    Update Account Details
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        ) : (
            <NotLogged />
        )
    );
}