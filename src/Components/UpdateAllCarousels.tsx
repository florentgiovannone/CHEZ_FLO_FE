import React, { SyntheticEvent, useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { baseUrl } from "../config";
import { ICarousels } from "../interfaces/carousels";

export default function UpdateAllCarousels() {
    const { contentId } = useParams()
    const navigate = useNavigate()
    const [formData, setFormData] = useState<Record<string, string>>({})

    React.useEffect(() => {
        async function fetchContent() {
            try {
                const resp = await axios.get(`${baseUrl}/content/${contentId}/carousel`);
                const carousels = resp.data;
                const formValues: Record<string, string> = {};
                carousels.forEach((carousel: ICarousels) => {
                    formValues[`carousel_${carousel.id}`] = String(carousel.carousel_url);
                });

                setFormData(formValues);
            } catch (err) {
                console.error("Error fetching content:", err);
            }
        }
        fetchContent();
    }, []);

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
                uploadPreset: "chez_flo_carousels",
                multiple: false,
                maxFiles: 1,
                cropping: true,
                croppingAspectRatio: 2384 / 1341,
                croppingShape: "rect",
                croppingCoordinatesMode: "custom",
                showSkipCropButton: false,
                folder: "chez_flo_carousels",
                transformation: [
                    { width: 2384, height: 1341, crop: "fill", fetch_format: "jpg" },
                ],
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
            (error: any, result: { event: string; info: { secure_url: string } }) => {
                if (error) {
                    console.error("Cloudinary Upload Error:", error);
                    return;
                }
                if (result && result.event === "success") {
                    setFormData(prev => ({
                        ...prev,
                        [field]: result.info.secure_url,
                    }));
                }
            }
        );

        widget.open();
    }

    async function handleSubmit(e: SyntheticEvent) {
        e.preventDefault();

        try {
            const carouselsData = Object.entries(formData).map(([key, value]) => ({
                id: Number(key.split('_')[1]),
                carousel_url: value,
                content_id: Number(contentId),
            }));

            await axios.put(`${baseUrl}/content/${contentId}/carousel`, carouselsData);
            navigate(`/carouselList/${contentId}`);
            // window.location.reload();
        } catch (err) {
            console.error("Error updating carousels:", err);
        }
    }

    return <>
        <div className="section flex items-center justify-center m-40">
            <div className="container w-full my-10">
                <h1 className="text-2xl mb-4">Update all carousels</h1>
                <div className="grid grid-flow-col grid-cols-12 gap-4 py-4 items-center rounded-3xl md:w-full font-bold text-black">
                    <div className="col-span-1 text-center ">Image</div>
                    <div className="col-span-1 text-center">ID</div>
                    <div className="col-span-6 text-center">URL</div>
                    <div className="inline-flex justify-end col-span-4">
                    </div>
                </div>
                <form>
                    {Object.keys(formData).map((key) => {
                        const carouselId = key.split('_')[1];
                        return (
                            <div key={key} className="grid grid-flow-col grid-cols-12 items-center md:w-full font-bold text-black gap-4 mb-4">
                                <figure className="w-32 col-span-1">
                                    <img
                                        className=" border-2 border-black"
                                        src={formData[key].toString()}
                                        alt="Placeholder image"
                                    />
                                </figure>
                                <div className="col-span-1 text-center">{carouselId}</div>
                                <textarea
                                    placeholder="Image URL"
                                    onChange={handleChange}
                                    name={key}
                                    value={formData[key]}
                                    className="col-span-6 border border-gray-300 rounded-xl"
                                />
                                <button
                                    type="button"
                                    className="col-span-4 rounded-xl h-full w-full bg-black text-beige hover:bg-opacity-50"
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
                            className="mb-5 rounded-xl col-span-8 w-full  h-12 bg-black text-beige hover:bg-opacity-50"
                        >
                            Upload all URLs
                        </button>
                        <button
                            onClick={() => navigate(`/carouselList/${contentId}`)}
                            className="mb-5 rounded-xl col-span-4 w-full  h-12 bg-black text-beige hover:bg-opacity-50"
                        >
                            Return to carousel list
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </>
}