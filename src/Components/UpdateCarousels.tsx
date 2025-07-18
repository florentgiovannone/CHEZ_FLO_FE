import React, { SyntheticEvent, useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { baseUrl } from "../config"
import { ICarousels } from "../interfaces/carousels"
import { IContent } from "../interfaces/content"
import { IUser } from "../interfaces/users"
import NotLogged from "./NotLogged"

interface CarouselsListProps {
    setContent: React.Dispatch<React.SetStateAction<IContent | null>>;
    content: IContent | null;
    carousels: ICarousels[];
    setCarousels: React.Dispatch<React.SetStateAction<ICarousels[]>>;
}

interface UserProps {
    user: null | IUser;
    setUser: Function;
}

export default function UpdateCarousels({ setContent, content, carousels, setCarousels, user }: CarouselsListProps & UserProps) {
    console.log(user)
    // State variables
    const [showDeleted, setShowDeleted] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [selectedCarousel, setSelectedCarousel] = useState<ICarousels | null>(null)
    const [addCarousel, setAddCarousel] = useState(false)
    const [formData, setFormData] = useState<Record<string, string>>({})
    const [uploadButton, setUploadButton] = useState(false)
    const { contentId } = useParams()

    useEffect(() => {
        async function fetchCarousels() {
            try {
                const response = await axios.get(`${baseUrl}/content/${contentId}/carousel`);
                if (response.data) {
                    setCarousels(response.data);
                }
            } catch (error) {
                console.error("Error fetching carousels:", error);
            }
        }
        fetchCarousels();
    }, [contentId, setCarousels]);

    // Handle input changes
    function handleChange(e: any) {
        const fieldName = e.target.name;
        const newFormData = structuredClone(formData);
        newFormData[fieldName] = e.target.value;
        setFormData(newFormData);
    }

    // Delete a carousel
    async function deleteCarousel() {
        if (!selectedCarousel) return
        const token = localStorage.getItem("token")
        const carouselId = selectedCarousel.id;

        try {
            await axios.delete(`${baseUrl}/content/${contentId}/carousel/${carouselId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            setCarousels(prev => prev.filter(carousel => carousel.id !== carouselId))

            setContent(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    carousels: prev.carousels.filter(carousel => carousel.id !== carouselId)
                }
            });

            setShowDeleted(true)
            setShowModal(false)
        } catch (error) {
            console.error("Delete failed:", error)
            alert("Something went wrong.")
            setShowModal(false)
            setSelectedCarousel(null)
        }
    }

    // Dismiss the delete message
    function dismissMessage() {
        setShowDeleted(false)
        setSelectedCarousel(null)
    }

    // Scroll to the bottom of the page when adding a new carousel
    const handleAddCarousel = () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth',
        });
        setAddCarousel(true)
    }

    // Handle the upload of a new carousel
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
                    console.log("Result info:", result.info);

                    try {
                        const { public_id, version, format, coordinates } = result.info;
                        console.log("Coordinates:", coordinates);

                        // If crop coordinates exist, apply them to build a cropped URL
                        let finalUrl = result.info.secure_url;

                        if (coordinates?.custom?.length > 0) {
                            const [x, y, width, height] = coordinates.custom[0];
                            console.log("Crop coordinates:", { x, y, width, height });
                            finalUrl = `https://res.cloudinary.com/ded4jhx7i/image/upload/c_crop,x_${x},y_${y},w_${width},h_${height}/v${version}/${public_id}.${format}`;
                            console.log("Final URL with crop:", finalUrl);
                        } else {
                            console.log("No crop coordinates found, using original URL:", finalUrl);
                        }

                        // Set cropped image URL in form
                        setFormData(prev => {
                            console.log("Setting form data with URL:", finalUrl);
                            const newFormData = {
                                ...prev,
                                [field]: finalUrl,
                            };
                            console.log("New form data:", newFormData);
                            return newFormData;
                        });

                        // If we're editing an existing carousel
                        if (selectedCarousel) {
                            // Update carousels state
                            setCarousels(prev => {
                                const newCarousels = prev.map(carousel =>
                                    carousel.id === selectedCarousel.id
                                        ? { ...carousel, carousel_url: finalUrl }
                                        : carousel
                                );
                                console.log("Updated carousels:", newCarousels);
                                return newCarousels;
                            });

                            // Update content state if it exists
                            if (content) {
                                setContent(prev => {
                                    if (!prev) return null;
                                    const newContent = {
                                        ...prev,
                                        carousels: prev.carousels.map(carousel =>
                                            carousel.id === selectedCarousel.id
                                                ? { ...carousel, carousel_url: finalUrl }
                                                : carousel
                                        )
                                    };
                                    console.log("Updated content:", newContent);
                                    return newContent;
                                });
                            }
                        }

                        setUploadButton(true);
                        console.log("Upload button set to true");
                    } catch (err) {
                        console.error("Error processing upload result:", err);
                        alert("Error processing the uploaded image. Please try again.");
                    }
                } else {
                    console.log("Upload result event:", result?.event);
                }
            }
        );

        widget.open();
    }

    // Handle the creation of a new carousel
    async function handlePost(e: SyntheticEvent) {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${baseUrl}/content/${contentId}/carousel`,
                {
                    carousel_url: formData.carousel_url
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setCarousels(prev => [...prev, response.data]);

            if (content) {
                setContent(prev => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        carousels: [...prev.carousels, response.data]
                    };
                });
            }

            setFormData({});
            setUploadButton(false);
            setAddCarousel(false);
            setShowDeleted(true);
            setTimeout(() => setShowDeleted(false), 3000);

        } catch (err) {
            console.error("Error creating carousel:", err);
            alert("Failed to create carousel. Please try again.");
        }
    }

    // Handle the update of a carousel
    async function handlePut(e: SyntheticEvent) {
        e.preventDefault();
        if (!selectedCarousel) return;
        try {
            const response = await axios.put(
                `${baseUrl}/content/${contentId}/carousel/${selectedCarousel.id}`,
                {
                    carousel_url: formData[`carousel_url_${selectedCarousel.id}`]
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            if (response.data && response.data.carousel) {
                setCarousels(prev => prev.map(carousel =>
                    carousel.id === selectedCarousel.id ? response.data.carousel : carousel
                ));

                if (content) {
                    setContent(prev => {
                        if (!prev) return null;
                        return {
                            ...prev,
                            carousels: prev.carousels.map(carousel =>
                                carousel.id === selectedCarousel.id ? response.data.carousel : carousel
                            )
                        };
                    });
                }
            }

            setFormData({});
            setSelectedCarousel(null);
            setShowDeleted(true);
            setTimeout(() => setShowDeleted(false), 3000);

        } catch (err) {
            console.error("Error updating carousel:", err);
            alert("Failed to update carousel. Please try again.");
        }
    }

    // Map the carousels to the carousel list
    const carouselMap = () =>
        carousels?.map((carousel: ICarousels) => (
            <div
                key={carousel.id}
                className="bg-black text-beige p-3 sm:p-4 rounded-xl"
            >
                <div className="space-y-3">
                    <a
                        href={
                            selectedCarousel?.id === carousel.id && formData[`carousel_url_${carousel.id}`]
                                ? formData[`carousel_url_${carousel.id}`].toString()
                                : carousel.carousel_url
                                    ? carousel.carousel_url.toString()
                                    : ''
                        }
                        className="block"
                        target="_blank"
                    >
                        <figure className="w-full">
                            <img
                                className="rounded-lg w-full h-32 sm:h-40 object-cover"
                                src={
                                    selectedCarousel?.id === carousel.id && formData[`carousel_url_${carousel.id}`]
                                        ? formData[`carousel_url_${carousel.id}`].toString()
                                        : carousel.carousel_url
                                            ? carousel.carousel_url.toString()
                                            : ''
                                }
                                alt="Carousel image"
                            />
                        </figure>
                    </a>
                    <div className="text-center text-sm sm:text-base font-medium">
                        ID: {carousel.id}
                    </div>
                    {!(selectedCarousel?.id === carousel.id && uploadButton) && (
                        <div className="space-y-2">
                            <button
                                onClick={(e) => {
                                    handleUpload(e, `carousel_url_${carousel.id}`)
                                    setUploadButton(false)
                                    setSelectedCarousel(carousel)
                                    setFormData({
                                        [`carousel_url_${carousel.id}`]: String(carousel.carousel_url)
                                    })
                                }}
                                className="w-full bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-2 px-3 sm:py-3 sm:px-4 rounded-lg text-sm sm:text-base transition-colors"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedCarousel(carousel)
                                    setShowModal(true)
                                }}
                                className="w-full bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-2 px-3 sm:py-3 sm:px-4 rounded-lg text-sm sm:text-base transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                    {selectedCarousel?.id === carousel.id && uploadButton && (
                        <div className="space-y-2">
                            <button
                                type="button"
                                className="w-full bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-2 px-3 sm:py-3 sm:px-4 rounded-lg text-sm sm:text-base transition-colors"
                                onClick={(e) => handleUpload(e, "carousel_url")}
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                className="w-full bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-2 px-3 sm:py-3 sm:px-4 rounded-lg text-sm sm:text-base transition-colors"
                                onClick={(e) => {
                                    handlePut(e)
                                    setAddCarousel(false)
                                    setUploadButton(false)
                                }}
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                className="w-full bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-2 px-3 sm:py-3 sm:px-4 rounded-lg text-sm sm:text-base transition-colors"
                                onClick={() => {
                                    if (selectedCarousel) {
                                        setCarousels(prev => prev.map(carousel =>
                                            carousel.id === selectedCarousel.id
                                                ? selectedCarousel
                                                : carousel
                                        ));
                                        if (content) {
                                            setContent(prev => {
                                                if (!prev) return null;
                                                return {
                                                    ...prev,
                                                    carousels: prev.carousels.map(carousel =>
                                                        carousel.id === selectedCarousel.id
                                                            ? selectedCarousel
                                                            : carousel
                                                    )
                                                };
                                            });
                                        }
                                    }
                                    setAddCarousel(false)
                                    setUploadButton(false)
                                    setSelectedCarousel(null)
                                    setFormData({})
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        ))

    // Render the component
    return (
        user ? (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-black">
                            Carousel Management
                        </h1>

                        {/* Add Carousel Button */}
                        <div className="mb-6">
                            <button
                                onClick={handleAddCarousel}
                                className="bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-3 px-6 rounded-xl text-sm sm:text-base transition-colors"
                            >
                                + Add New Carousel
                            </button>
                        </div>

                        {/* Carousel List */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            {carouselMap()}
                        </div>

                        {/* Add Carousel Form */}
                        {addCarousel && (
                            <div key="add-carousel-form" className="bg-black text-beige p-4 sm:p-6 rounded-xl mt-6">
                                <h2 className="text-lg sm:text-xl font-bold mb-4">Add New Carousel</h2>
                                <div className="space-y-4">
                                    {!uploadButton && (
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <button
                                                key="add-carousel-upload-btn"
                                                type="button"
                                                className="flex-1 bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-3 px-4 rounded-lg text-sm sm:text-base transition-colors"
                                                onClick={(e) => handleUpload(e, "carousel_url")}
                                            >
                                                Upload Image
                                            </button>
                                            <button
                                                key="add-carousel-cancel-btn"
                                                type="button"
                                                className="flex-1 bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-3 px-4 rounded-lg text-sm sm:text-base transition-colors"
                                                onClick={() => {
                                                    setAddCarousel(false)
                                                    setFormData({ carousel_url: "" })
                                                    setUploadButton(false)
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {uploadButton && (
                                    <div className="space-y-4">
                                        <div className="space-y-3">
                                            <a href={formData.carousel_url ? formData.carousel_url.toString() : ''} className="block" target="_blank">
                                                <figure key={`figure-${formData.carousel_url}`} className="w-full">
                                                    <img
                                                        className="rounded-lg w-full h-48 sm:h-64 object-cover"
                                                        src={formData.carousel_url ? formData.carousel_url.toString() : ''}
                                                        alt="Preview image"
                                                    />
                                                </figure>
                                            </a>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <button
                                                key="add-carousel-edit-btn"
                                                type="button"
                                                className="bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-3 px-4 rounded-lg text-sm sm:text-base transition-colors"
                                                onClick={(e) => handleUpload(e, "carousel_url")}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                key="add-carousel-save-btn"
                                                type="button"
                                                className="bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-3 px-4 rounded-lg text-sm sm:text-base transition-colors"
                                                onClick={(e) => {
                                                    handlePost(e)
                                                }}
                                            >
                                                Save
                                            </button>
                                            <button
                                                key="add-carousel-cancel-btn"
                                                type="button"
                                                className="bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-3 px-4 rounded-lg text-sm sm:text-base transition-colors"
                                                onClick={() => {
                                                    setAddCarousel(false)
                                                    setFormData({ carousel_url: "" })
                                                    setUploadButton(false)
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 sm:mt-10">
                            <a href="/dashboard" className="flex-1 sm:flex-none">
                                <button className="w-full sm:w-auto bg-black hover:bg-gray-800 text-beige hover:text-beige border border-black hover:border-gray-800 font-bold py-3 px-6 rounded-lg text-sm sm:text-base transition-colors">
                                    Return to Dashboard
                                </button>
                            </a>
                            <a href="/EditMainPage" className="flex-1 sm:flex-none">
                                <button className="w-full sm:w-auto bg-black hover:bg-gray-800 text-beige hover:text-beige border border-black hover:border-gray-800 font-bold py-3 px-6 rounded-lg text-sm sm:text-base transition-colors">
                                    Return to Edit Page
                                </button>
                            </a>
                        </div>

                        {/* Success Message */}
                        {showDeleted && selectedCarousel && (
                            <div className="flex justify-center items-center mt-6">
                                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-beige px-4 py-3 rounded-xl">
                                    <h1 className="text-center text-sm sm:text-base font-semibold text-black">
                                        Carousel {selectedCarousel.id} has been deleted
                                    </h1>
                                    <button
                                        onClick={dismissMessage}
                                        className="bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-2 px-4 rounded-lg text-sm transition-colors"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal */}
                {showModal && selectedCarousel && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
                        <div className="bg-beige p-6 sm:p-8 rounded-2xl shadow-xl max-w-sm sm:max-w-md w-full text-center">
                            <h2 className="text-lg sm:text-xl font-bold mb-4 text-black">Confirm Deletion</h2>
                            <p className="text-gray-700 mb-6 text-sm sm:text-base">
                                Are you sure you want to delete{" "}
                                <strong>
                                    {selectedCarousel.id}
                                </strong>
                                ?
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                                <button
                                    onClick={() => {
                                        deleteCarousel()
                                        setShowModal(false)
                                        setShowDeleted(false)
                                    }}
                                    className="bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-3 px-4 rounded-lg text-sm sm:text-base transition-colors"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-3 px-4 rounded-lg text-sm sm:text-base transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        ) : (
            <NotLogged />
        )
    );
}