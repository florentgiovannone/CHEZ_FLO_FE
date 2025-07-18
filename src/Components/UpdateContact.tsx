import React, { SyntheticEvent, useState } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { baseUrl } from "../config";
import { IContent } from "../interfaces/content";
import NotLogged from "./NotLogged";
import { IUser } from "../interfaces/users";

interface UpdateContactProps {
    setContent: React.Dispatch<React.SetStateAction<IContent | null>>;
    content: IContent | null;
}

interface UserProps {
    user: null | IUser;
    setUser: Function;
}

export default function UpdateContact({ content, setContent, user, setUser }: UpdateContactProps & UserProps) {
    const { contentId } = useParams()
    const navigate = useNavigate()
    const [uploadButton, setUploadButton] = useState(false)

    const [formData, setFormData] = useState({
        contact_title: "",
        contact_address_one: "",
        contact_address_two: "",
        phone: "",
        email: "",
        contact_opening_day_one: "",
        contact_opening_hours_one: "",
        contact_opening_day_two: "",
        contact_opening_hours_two: "",
        contact_opening_day_three: "",
        contact_opening_hours_three: "",
        map: "",
    })

    // Initialize form data with content values if they exist
    React.useEffect(() => {
        if (content) {
            setFormData({
                contact_title: String(content.contact_title) || "",
                contact_address_one: String(content.contact_adress_one) || "",
                contact_address_two: String(content.contact_adress_two) || "",
                phone: String(content.phone) || "",
                email: String(content.email) || "",
                contact_opening_day_one: String(content.contact_opening_day_one) || "",
                contact_opening_hours_one: String(content.contact_opening_hours_one) || "",
                contact_opening_day_two: String(content.contact_opening_day_two) || "",
                contact_opening_hours_two: String(content.contact_opening_hours_two) || "",
                contact_opening_day_three: String(content.contact_opening_day_three) || "",
                contact_opening_hours_three: String(content.contact_opening_hours_three) || "",
                map: String(content.map) || "",
            })
        }
    }, [content])

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
                folder: "chez_flo_map",
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

    function handleChange(e: any) {
        const fieldName = e.target.name
        const newFormData = structuredClone(formData)
        newFormData[fieldName as keyof typeof formData] = e.target.value
        setFormData(newFormData)
    }

    async function handleSubmit(e: SyntheticEvent) {
        e.preventDefault();
        try {
            const resp = await axios.put(`${baseUrl}/content/${contentId}/contact`, formData);
            console.log("Update successful:", resp.data);

            navigate("/dashboard");
            window.location.reload();

        } catch (err) {
            console.error("Update failed:", err);
        }
    }

    return (
        user ? (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-black">
                            Update Contact Information
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 mb-6">
                            Please note that only the text content will be edited, and no changes will be made to the line structure, such as adding or removing line breaks
                        </p>

                        <form className="space-y-6">
                            {/* Title */}
                            <div className="space-y-2">
                                <label className="text-sm sm:text-base font-semibold text-black">
                                    Title
                                </label>
                                <input
                                    className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                                    placeholder="Enter contact title"
                                    type="text"
                                    name="contact_title"
                                    onChange={handleChange}
                                    value={formData.contact_title}
                                />
                            </div>

                            {/* Address Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm sm:text-base font-semibold text-black">
                                        Address Line One
                                    </label>
                                    <input
                                        className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                                        placeholder="Enter address line one"
                                        name="contact_address_one"
                                        onChange={handleChange}
                                        value={formData.contact_address_one}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm sm:text-base font-semibold text-black">
                                        Address Line Two
                                    </label>
                                    <input
                                        className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                                        placeholder="Enter address line two"
                                        type="text"
                                        name="contact_address_two"
                                        onChange={handleChange}
                                        value={formData.contact_address_two}
                                    />
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm sm:text-base font-semibold text-black">
                                        Email
                                    </label>
                                    <input
                                        className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                                        placeholder="Enter email address"
                                        type="email"
                                        name="email"
                                        onChange={handleChange}
                                        value={formData.email}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm sm:text-base font-semibold text-black">
                                        Phone
                                    </label>
                                    <input
                                        className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                                        placeholder="Enter phone number"
                                        type="tel"
                                        name="phone"
                                        onChange={handleChange}
                                        value={formData.phone}
                                    />
                                </div>
                            </div>

                            {/* Opening Hours */}
                            <div className="space-y-4">
                                <h2 className="text-lg sm:text-xl font-semibold text-black border-b border-gray-200 pb-2">
                                    Opening Hours
                                </h2>

                                {/* Day One */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm sm:text-base font-semibold text-black">
                                            Day One
                                        </label>
                                        <input
                                            className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                                            placeholder="e.g., Monday"
                                            type="text"
                                            name="contact_opening_day_one"
                                            onChange={handleChange}
                                            value={formData.contact_opening_day_one}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm sm:text-base font-semibold text-black">
                                            Hours Day One
                                        </label>
                                        <input
                                            className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                                            placeholder="e.g., 9:00 AM - 5:00 PM"
                                            type="text"
                                            name="contact_opening_hours_one"
                                            onChange={handleChange}
                                            value={formData.contact_opening_hours_one}
                                        />
                                    </div>
                                </div>

                                {/* Day Two */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm sm:text-base font-semibold text-black">
                                            Day Two
                                        </label>
                                        <input
                                            className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                                            placeholder="e.g., Tuesday"
                                            type="text"
                                            name="contact_opening_day_two"
                                            onChange={handleChange}
                                            value={formData.contact_opening_day_two}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm sm:text-base font-semibold text-black">
                                            Hours Day Two
                                        </label>
                                        <input
                                            className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                                            placeholder="e.g., 9:00 AM - 5:00 PM"
                                            type="text"
                                            name="contact_opening_hours_two"
                                            onChange={handleChange}
                                            value={formData.contact_opening_hours_two}
                                        />
                                    </div>
                                </div>

                                {/* Day Three */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm sm:text-base font-semibold text-black">
                                            Day Three
                                        </label>
                                        <input
                                            className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                                            placeholder="e.g., Wednesday"
                                            type="text"
                                            name="contact_opening_day_three"
                                            onChange={handleChange}
                                            value={formData.contact_opening_day_three}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm sm:text-base font-semibold text-black">
                                            Hours Day Three
                                        </label>
                                        <input
                                            className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                                            placeholder="e.g., 9:00 AM - 5:00 PM"
                                            type="text"
                                            name="contact_opening_hours_three"
                                            onChange={handleChange}
                                            value={formData.contact_opening_hours_three}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Map Section */}
                            <div className="space-y-4">
                                <h2 className="text-lg sm:text-xl font-semibold text-black border-b border-gray-200 pb-2">
                                    Map Image
                                </h2>
                                <div className="bg-black text-beige p-4 sm:p-6 rounded-xl">
                                    <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-4 items-start">
                                        {/* Image Preview */}
                                        <div className="flex justify-center lg:justify-start">
                                            <a href={formData.map} className="block" target="_blank">
                                                <figure className="w-full">
                                                    <img
                                                        className="rounded-lg border-4 border-black w-32 h-32 sm:w-40 sm:h-40 object-cover"
                                                        src={`${formData.map.toString()}?v=${Date.now()}`}
                                                        alt="Map preview"
                                                    />
                                                </figure>
                                            </a>
                                        </div>

                                        {/* Upload Button */}
                                        <div className="flex justify-center lg:justify-end">
                                            <button
                                                type="button"
                                                className="w-full sm:w-32 h-12 sm:h-32 bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-2 px-4 rounded-lg text-sm sm:text-base transition-colors"
                                                onClick={(e) => handleUpload(e, "map")}
                                            >
                                                Update Image
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                                <button
                                    onClick={() => navigate(`/dashboard`)}
                                    className="w-full sm:w-auto bg-black hover:bg-gray-800 text-beige hover:text-beige border border-black hover:border-gray-800 font-bold py-3 px-6 rounded-lg text-sm sm:text-base transition-colors"
                                >
                                    Cancel and Return to Dashboard
                                </button>

                                <button
                                    onClick={() => navigate(`/EditMainPage`)}
                                    className="w-full sm:w-auto bg-black hover:bg-gray-800 text-beige hover:text-beige border border-black hover:border-gray-800 font-bold py-3 px-6 rounded-lg text-sm sm:text-base transition-colors"
                                >
                                    Cancel and Return to Edit Page
                                </button>

                                <button
                                    onClick={handleSubmit}
                                    className="w-full sm:w-auto bg-black hover:bg-gray-800 text-beige hover:text-beige border border-black hover:border-gray-800 font-bold py-3 px-6 rounded-lg text-sm sm:text-base transition-colors"
                                >
                                    Update and Return to Dashboard
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