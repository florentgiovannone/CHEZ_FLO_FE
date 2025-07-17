import React, { SyntheticEvent, useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { baseUrl } from "../config";
import { IContent } from "../interfaces/content";
import { ICarousels } from "../interfaces/carousels";

interface CarouselsListProps {
    setContent: React.Dispatch<React.SetStateAction<IContent | null>>;
    content: IContent | null;
    carousels: ICarousels[];
    setCarousels: React.Dispatch<React.SetStateAction<ICarousels[]>>;
}

export default function UpdateAllCarousels({ carousels, setCarousels }: CarouselsListProps) {
    console.log(carousels)
    const { contentId } = useParams()
    const navigate = useNavigate()
    const [formData, setFormData] = useState<Record<string, string>>({})

    useEffect(() => {
        // Initialize formData with existing carousels
        const initialFormData = carousels.reduce((acc, carousel) => {
            acc[`carousel_url_${carousel.id}`] = carousel.carousel_url.toString();
            return acc;
        }, {} as Record<string, string>);
        setFormData(initialFormData);
    }, [carousels]);

    function handleChange(e: any) {
        const fieldName = e.target.name;
        const newFormData = structuredClone(formData);
        newFormData[fieldName] = e.target.value;
        setFormData(newFormData);
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
                croppingAspectRatio: 21 / 10,
                croppingCoordinatesMode: "custom",
                showSkipCropButton: false,
                folder: "chez_flo_carousels",
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

                }
            }
        );

        widget.open();
    }

    async function handleSubmit(e: SyntheticEvent) {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("You must be logged in to update carousels");
                return;
            }

            // Update each carousel individually
            for (const [key, value] of Object.entries(formData)) {
                const carouselId = key.replace('carousel_url_', '');
                try {
                    await axios.put(
                        `${baseUrl}/content/${contentId}/carousel/${carouselId}`,
                        {
                            carousel_url: value
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            }
                        }
                    );
                } catch (err) {
                    console.error(`Error updating carousel ${carouselId}:`, err);
                }
            }

            // Fetch the updated carousels
            const response = await axios.get(`${baseUrl}/content/${contentId}/carousel`);
            if (response.data) {
                setCarousels(response.data);
            }

            navigate(`/carouselsList/${contentId}`);
        } catch (err) {
            console.error("Error updating carousels:", err);
            alert("Failed to update carousels. Please try again.");
        }
    }

    return <>
        <div className="flex flex-col bg-white m-36">
            <h1 className="text-2xl font-bold mb-4 text-black">Update all carousels</h1>
            <div className="grid grid-flow-col grid-cols-12 items-center rounded-3xl md:w-full font-bold text-black">
                <div className="col-span-1 text-center">Preview</div>
                <div className="col-span-2 text-center">ID</div>
                <div className="col-span-8 text-center">URL</div>
                <div className="inline-flex justify-end col-span-1">
                </div>
            </div>
            <form>
                {Object.keys(formData).map((key) => {
                    const carouselId = key.replace('carousel_url_', '');
                    return (
                        <div key={key} className="bg-black text-beige grid grid-flow-col grid-cols-12 my-2 p-2 items-center rounded-xl md:w-full gap-4">
                            <a href={formData[key]} className="w-48 col-span-1" target="_blank">
                                <figure className="w-48">
                                    <img
                                        className="rounded-xl border-4 border-black w-48 h-32 object-cover"
                                        src={formData[key].toString()}
                                        alt="Placeholder image"
                                    />
                                </figure>
                            </a>
                            <div className="col-span-2 text-center">{carouselId}</div>
                            <textarea
                                placeholder="Image URL"
                                onChange={handleChange}
                                name={key}
                                value={formData[key]}
                                className="col-span-8 text-black border border-gray-300 rounded-xl p-4 h-32 bg-beige text-grey resize-none"
                                disabled={true}
                            />
                            <button
                                type="button"
                                className="col-span-1 h-32 w-full bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 rounded-xl"
                                onClick={(e) => handleUpload(e, key)}
                            >
                                Update image
                            </button>
                        </div>
                    );
                })}
                <div className="grid grid-flow-col grid-cols-12 items-center rounded-3xl md:w-full font-bold text-black gap-4 mb-4">
                    <button
                        onClick={handleSubmit}
                        className="mb-5 rounded-xl col-span-6 w-full h-12 bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4"
                    >
                        Upload all URLs and return to carousel list
                    </button>
                    <button
                        onClick={() => navigate(`/carouselsList/${contentId}`)}
                        className="mb-5 rounded-xl col-span-6 w-full h-12 bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4"
                    >
                        Cancel and return to carousel list
                    </button>
                </div>
            </form>
        </div>
    </>
}