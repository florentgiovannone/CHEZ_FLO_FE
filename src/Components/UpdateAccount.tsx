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
        <>
            {user ? (
                <div className="section flex items-center justify-center min-h-screen bg-gray-50 px-4">
                    <div className="container w-full ">
                        <h1 className="text-2xl">Update your details</h1>
                        <form>
                            <div className="field mt-4">
                                <h1 className="text-xl">Username</h1>
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
                                <h1 className="text-xl">Firstname</h1>
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
                                <h1 className="text-xl">Lastname</h1>
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
                                <h1 className="text-xl">Email</h1>
                                <input
                                    className="w-full p-4 border border-gray-300 rounded-md"
                                    placeholder="Email"
                                    type="text"
                                    name="email"
                                    onChange={handleChange}
                                    value={formData.email}
                                />
                            </div>
                            <div className="field mt-4 ">
                                <h1 className="text-xl">Profile Image</h1>
                                <div className="bg-black text-beige grid grid-cols-10 my-2 p-2 items-center rounded-xl md:w-full gap-4">
                                    {!formData.image ? (
                                        <figure className="w-48 flex justify-center col-span-2">
                                            <img
                                                className="rounded-full w-32 h-32 object-cover"
                                                alt="Placeholder"
                                                src="https://cdn.pixabay.com/photo/2017/02/23/13/05/avatar-2092113_1280.png"
                                            />
                                        </figure>
                                    ) : (
                                        <figure className="w-48 flex justify-center col-span-2">
                                            <img
                                                className="rounded-full border-4 border-beige w-32 h-32 object-cover"
                                                src={formData.image}
                                                alt="Placeholder image"
                                            />
                                        </figure>
                                    )}
                                    <div className="grid grid-cols-8 gap-2 col-span-8">
                                        {!uploadButton && (
                                            <>
                                                <button
                                                    type="button"
                                                    className="col-span-4 h-32 w-full bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 rounded-xl"
                                                    onClick={(e) => handleUpload(e, "image")}
                                                >
                                                    Update image
                                                </button>
                                                <button
                                                    type="button"
                                                    className="col-span-4 h-32 w-full bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 rounded-xl"
                                                    onClick={() => setFormData({
                                                        ...formData,
                                                        image: ""
                                                    })}
                                                >
                                                    Delete image
                                                </button>
                                            </>
                                        )}
                                        {uploadButton && (
                                            <>
                                                <button
                                                    type="button"
                                                    className="col-span-4 h-32 w-full bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 rounded-xl"
                                                    onClick={(e) => {
                                                        saveImage(e);
                                                        setUploadButton(false);
                                                    }}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    type="button"
                                                    className="col-span-4 h-32 w-full bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 rounded-xl"
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
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button
                                    onClick={handleSubmit}
                                    className="mb-5 rounded-xl w-full sm:w-96 h-12 bg-black text-beige hover:bg-opacity-50"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <NotLogged />
            )}
        </>
    );
}