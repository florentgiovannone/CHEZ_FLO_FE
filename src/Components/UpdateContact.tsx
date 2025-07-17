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

    // async function handlePut(e: SyntheticEvent) {
    //     e.preventDefault();
    //     try {
    //         const response = await axios.put(
    //             `${baseUrl}/content/${contentId}/contact`,

    //             {
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `Bearer ${localStorage.getItem("token")}`
    //                 }
    //             }
    //         );

    //         if (response.data) {

    //             if (content) {
    //                 setContent((prev: IContent | null) => {
    //                     if (!prev) return null;
    //                     return {
    //                         ...prev,
    //                         contact_title: response.data.contact_title,
    //                         contact_address_one: response.data.contact_address_one,
    //                         contact_address_two: response.data.contact_address_two,
    //                         contact_opening_day_one: response.data.contact_opening_day_one,
    //                         contact_opening_hours_one: response.data.contact_opening_hours_one,
    //                         contact_opening_day_two: response.data.contact_opening_day_two,
    //                         contact_opening_hours_two: response.data.contact_opening_hours_two,
    //                         contact_opening_day_three: response.data.contact_opening_day_three,
    //                         contact_opening_hours_three: response.data.contact_opening_hours_three,
    //                     };
    //                 });
    //             }
    //         }

    //         setFormData({
    //             contact_title: "",
    //             contact_address_one: "",
    //             contact_address_two: "",
    //             contact_opening_day_one: "",
    //             contact_opening_hours_one: "",
    //             contact_opening_day_two: "",
    //             contact_opening_hours_two: "",
    //             contact_opening_day_three: "",
    //             contact_opening_hours_three: "",
    //             map: "",
    //         });

    //     } catch (err) {
    //         console.error("Error updating menu:", err);
    //         alert("Failed to update menu. Please try again.");
    //     }
    // }

    return <>
        {(user ? <div className="my-10 section flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="container w-full ">
                <h1 className="text-2xl">Update Reservation section</h1>
                <p>Please note that only the text content will be edited, and no changes will be made to the line structure, such as adding or removing line breaks</p>
                <form>
                    <div className="field mt-4">
                        <h1 className="text-xl">Title</h1>
                        <input
                            className="w-full p-4 border border-gray-300 rounded-md"
                            placeholder="contact_title"
                            type="text"
                            name="contact_title"
                            onChange={handleChange}
                            value={formData.contact_title}
                        />
                    </div>
                    <div className="field mt-4">
                        <h1 className="text-xl">Adress line one</h1>
                        <input
                            className="w-full  p-4 border border-gray-300 rounded-md"
                            placeholder="contact_address_one"
                            name="contact_address_one"
                            onChange={handleChange}
                            value={formData.contact_address_one}
                        />
                    </div>
                    <div className="field mt-4">
                        <h1 className="text-xl">Adress line two</h1>
                        <input
                            className="w-full p-4 border border-gray-300 rounded-md"
                            placeholder="contact_address_two"
                            type="text"
                            name="contact_address_two"
                            onChange={handleChange}
                            value={formData.contact_address_two}
                        />
                    </div>
                    <div className="field mt-4">
                        <h1 className="text-xl">Email</h1>
                        <input
                            className="w-full p-4 border border-gray-300 rounded-md"
                            placeholder="contact_email"
                            type="text"
                            name="email"
                            onChange={handleChange}
                            value={formData.email}
                        />
                    </div>
                    <div className="field mt-4">
                        <h1 className="text-xl">Phone</h1>
                        <input
                            className="w-full p-4 border border-gray-300 rounded-md"
                            placeholder="phone"
                            type="text"
                            name="phone"
                            onChange={handleChange}
                            value={formData.phone}
                        />
                    </div>
                    <div className="field mt-4">
                        <h1 className="text-xl">Opening day one</h1>
                        <input
                            className="w-full p-4 border border-gray-300 rounded-md"
                            placeholder="contact_opening_day_one"
                            type="text"
                            name="contact_opening_day_one"
                            onChange={handleChange}
                            value={formData.contact_opening_day_one}
                        />
                    </div>
                    <div className="field mt-4">
                        <h1 className="text-xl">Opening hours day one</h1>
                        <input
                            className="w-full p-4 border border-gray-300 rounded-md"
                            placeholder="contact_opening_hours_one"
                            type="text"
                            name="contact_opening_hours_one"
                            onChange={handleChange}
                            value={formData.contact_opening_hours_one}
                        />
                    </div>
                    <div className="field mt-4">
                        <h1 className="text-xl">Opening hours day two</h1>
                        <input
                            className="w-full p-4 border border-gray-300 rounded-md"
                            placeholder="contact_opening_day_two"
                            type="text"
                            name="contact_opening_day_two"
                            onChange={handleChange}
                            value={formData.contact_opening_day_two}
                        />
                    </div>
                    <div className="field mt-4">
                        <h1 className="text-xl">Opening hours day two</h1>
                        <input
                            className="w-full p-4 border border-gray-300 rounded-md"
                            placeholder="contact_opening_day_two"
                            type="text"
                            name="contact_opening_day_two"
                            onChange={handleChange}
                            value={formData.contact_opening_hours_two}
                        />
                    </div>
                    <div className="field mt-4">
                        <h1 className="text-xl">Opening day three</h1>
                        <input
                            className="w-full p-4 border border-gray-300 rounded-md"
                            placeholder="contact_opening_day_three"
                            type="text"
                            name="contact_opening_day_three"
                            onChange={handleChange}
                            value={formData.contact_opening_day_three}
                        />
                    </div>
                    <div className="field mt-4">
                        <h1 className="text-xl">Opening hours day three</h1>
                        <input
                            className="w-full p-4 border border-gray-300 rounded-md"
                            placeholder="contact_opening_hours_three"
                            type="text"
                            name="contact_opening_hours_three"
                            onChange={handleChange}
                            value={formData.contact_opening_hours_three}
                        />
                    </div>
                    <div className="field mt-4">
                        <h1 className="text-xl">Map</h1>
                        <div className="bg-black text-beige grid grid-cols-[auto_1fr_auto] my-2 p-2 items-center rounded-xl md:w-full gap-4">
                            <a href={formData.map} className="w-48 flex justify-center" target="_blank">
                                <figure className="w-48 flex justify-center">
                                    <img
                                        className="rounded-xl border-4 border-black w-32 h-32 object-cover"
                                        src={`${formData.map.toString()}?v=${Date.now()}`}
                                        alt="Placeholder image"
                                    />
                                </figure>
                            </a>
                            <textarea
                                placeholder="Image URL"
                                onChange={handleChange}
                                name="map"
                                value={formData.map}
                                className="text-black border border-gray-300 rounded-xl p-4 h-32 bg-beige text-grey resize-none"
                                disabled={true}
                            />
                            <div className="grid grid-cols-1 gap-2"><>
                                <button
                                    type="button"
                                    className="h-32 w-32 bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 rounded-xl"
                                    onClick={(e) => handleUpload(e, "map")}
                                >
                                    Update image
                                </button>
                            </>
                                {/* {uploadButton && (
                                    <>
                                        <button
                                            type="button"
                                            className="h-32 w-32 bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 rounded-xl"
                                            onClick={(e) => {
                                                handleSubmit;
                                                setUploadButton(false);
                                            }}
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            className="h-32 w-32 bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 rounded-xl"
                                            onClick={() => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    map: content?.map ? String(content.map) : ""
                                                }));
                                                setUploadButton(false);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )} */}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center mt-10 gap-4">
                        <button
                            onClick={() => navigate(`/dashboard`)}
                            className="mb-5 rounded-xl w-full sm:w-96 h-12 bg-black text-beige hover:bg-opacity-50"
                        >
                            Cancel and return to dashboard
                        </button>

                        <button
                            onClick={() => navigate(`/EditMainPage`)}
                            className="mb-5 rounded-xl w-full sm:w-96 h-12 bg-black text-beige hover:bg-opacity-50"
                        >
                            Cancel and return to edit page
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="mb-5 rounded-xl w-full sm:w-96 h-12 bg-black text-beige hover:bg-opacity-50"
                        >
                            Update and return to dashboard
                        </button>
                    </div>
                </form>
            </div>
        </div>
        :
        <NotLogged />
    )}
    </>
}