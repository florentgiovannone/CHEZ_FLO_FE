import React, { SyntheticEvent, useState } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { baseUrl } from "../config";

export default function updateAccount() {

    const { userId } = useParams()
    const navigate = useNavigate()

    React.useEffect(() => {
        async function fetchUser() {
            const token = localStorage.getItem('token')
const resp = await axios.get(`${baseUrl}/users/${userId}`, {
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
    function handleChange(e: any) {
        const fieldName = e.target.name
        const newFormData = structuredClone(formData)
        newFormData[fieldName as keyof typeof formData] = e.target.value
        setFormData(newFormData)
    }
    async function handleSubmit(e: SyntheticEvent) {
        e.preventDefault()
        const token = localStorage.getItem('token')
        const resp = await axios.put(`${baseUrl}/users/${userId}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        navigate(`/dashboard`)
        window.location.reload();
    }
    function handleUpload(e: SyntheticEvent) {
        e.preventDefault()

        window.cloudinary.createUploadWidget(
            
            {
                
                cloudName: "ded4jhx7i",
                uploadPreset: "chezflo",
                cropping: true,
                croppingAspectRatio: 1,
                croppingShape: "circle",
                croppingCoordinatesMode: "custom",
                showSkipCropButton: false,
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
                (err: any, result: { event: string; info: { secure_url: any; }; }) => {
                    if (result.event !== "success") {
                        return;
                    }
                    console.log(result);

                    setFormData({
                        ...formData,
                        image: result.info.secure_url,
                    });
                },
                
            )
            
            .open();
    }

    return <>
        <div className="section flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="container w-full ">
                <h1 className="text-2xl">Update your details</h1>
                <form>
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
                    <div>
                        <button
                            onClick={handleSubmit}
                            className="mb-5 rounded-full w-full sm:w-96 h-12 bg-black text-beige hover:bg-opacity-50"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </>
}