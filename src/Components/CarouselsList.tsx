import React, { SyntheticEvent, useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { baseUrl } from "../config"
import { ICarousels } from "../interfaces/carousels"
import { IContent } from "../interfaces/content"

interface CarouselsListProps {
    setContent: React.Dispatch<React.SetStateAction<IContent | null>>;
    content: IContent | null;
}

    export default function CarouselsList({ setContent, content }: CarouselsListProps) {
    // State variables
    const [showDeleted, setShowDeleted] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [selectedCarousel, setSelectedCarousel] = useState<ICarousels | null>(null)
    const [carousels, setCarousels] = useState<ICarousels[]>([])
    const [addCarousel, setAddCarousel] = useState(false)
    const [formData, setFormData] = useState<Record<string, string>>({})
    const [uploadButton, setUploadButton] = useState(false)
    const [showUpdateForm, setShowUpdateForm] = useState(false)

    // Get the contentId from the URL
    const { contentId } = useParams()

    // Fetch the carousels and initialize the form data
    React.useEffect(() => {
        async function fetchContent() {
            if (!contentId) {
                console.error("No contentId provided");
                return;
            }
            try {
                const resp = await axios.get(`${baseUrl}/content/${contentId}/carousel`);
                const carousels = resp.data;
                setCarousels(carousels);
                const initialFormData: Record<string, string> = {};
                carousels.forEach((carousel: ICarousels) => {
                    initialFormData[`carousel_${carousel.id}`] = String(carousel.carousel_url);
                });
                setFormData(initialFormData);
            } catch (err) {
                console.error("Error fetching content:", err);
            }
        }
        fetchContent();
    }, [contentId]);

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

    // Map the carousels to the carousel list
    const carouselMap = () =>
        carousels?.map((carousel: ICarousels) => (
            <div
                key={carousel.id}
                className="bg-black text-beige grid grid-flow-col grid-cols-12 my-2 p-2 items-center rounded-3xl md:w-full"
            >
                <figure key={`figure-${carousel.id}`} className="w-32 col-span-1">
                    <img
                        className="rounded-full border-4 border-black"
                        src={carousel.carousel_url ? carousel.carousel_url.toString() : ''}
                        alt="Placeholder image"
                    />
                </figure>
                <div key={`id-${carousel.id}`} className="col-span-1 text-center">{carousel.id}</div>
                {selectedCarousel?.id === carousel.id && showUpdateForm ? (
                    <div key={`form-${carousel.id}`} className="break-words col-span-10">
                        <form key={`form-inner-${carousel.id}`} className="flex gap-2 ">
                            <textarea
                                key={`textarea-${carousel.id}`}
                                placeholder="Image URL"
                                onChange={handleChange}
                                name={`carousel_${carousel.id}`}
                                value={formData[`carousel_${carousel.id}`] || ""}
                                className=" text-black flex-grow border border-gray-300 rounded-xl p-2"
                            />
                            <div key={`buttons-${carousel.id}`} className="inline-flex justify-end col-span-2">
                                {!uploadButton && (<button
                                    key={`update-btn-${carousel.id}`}
                                    onClick={(e) => {
                                        handleUpload(e, `carousel_${carousel.id}`)
                                        setShowUpdateForm(true)
                                        setUploadButton(false)
                                    }}
                                    type="submit"
                                    className="col-span-1 bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 mr-2 rounded-xl"
                                >
                                    Update image
                                </button>)}
                                {!uploadButton && (<button
                                    key={`cancel-btn-${carousel.id}`}
                                    onClick={() => setShowUpdateForm(false)}
                                    type="submit"
                                    className="col-span-1 bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 mr-2 rounded-xl"
                                >
                                    Cancel
                                </button>)}
                                {uploadButton && (<button
                                    key={`save-btn-${carousel.id}`}
                                    type="button"
                                    onClick={(e) => {
                                        handlePut(e)
                                        setShowUpdateForm(false)
                                        setUploadButton(false)
                                    }}
                                    className="col-span-1 bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 mr-2 rounded-xl"
                                >
                                    Save
                                </button>)}
                                {uploadButton && (<button
                                    key={`cancel-upload-btn-${carousel.id}`}
                                    type="button"
                                    onClick={() => {
                                        setShowUpdateForm(false)
                                        setUploadButton(false)
                                    }}
                                    className="bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 mr-2 rounded-xl"
                                >
                                    Cancel
                                </button>)}
                            </div>
                        </form>
                    </div>
                ) : (
                    <div key={`url-${carousel.id}`} className="col-span-8 break-words">{carousel.carousel_url ? carousel.carousel_url.toString() : ''}</div>
                )}
                <div key={`actions-${carousel.id}`} className="inline-flex justify-end col-span-2">
                    {!(selectedCarousel?.id === carousel.id && showUpdateForm) && (
                        <>
                            <button
                                key={`update-action-${carousel.id}`}
                                onClick={(e) => {
                                    e.preventDefault()
                                    setSelectedCarousel(carousel)
                                    setShowUpdateForm(true)
                                    setFormData({ [`carousel_${carousel.id}`]: String(carousel.carousel_url) })
                                }}
                                className="bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 mr-2 rounded-xl"
                            >
                                Update
                            </button>
                            <button
                                key={`delete-action-${carousel.id}`}
                                onClick={() => {
                                    setSelectedCarousel(carousel)
                                    setShowModal(true)
                                    setShowDeleted(false)
                                }}
                                className="bg-black hover:bg-beige text-beige hover:text-black border hover:border-black border-beige font-bold py-2 px-4 rounded-xl"
                            >
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>
        ))

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
                    setUploadButton(true);
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
                    carousel_url: formData[`carousel_${selectedCarousel.id}`]
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
            setShowUpdateForm(false);
            setSelectedCarousel(null);
            setShowDeleted(true);
            setTimeout(() => setShowDeleted(false), 3000);

        } catch (err) {
            console.error("Error updating carousel:", err);
            alert("Failed to update carousel. Please try again.");
        }
    }
    // Render the component
    return <>
        {/* Main container */}
        <div className=" flex flex-col bg-white m-36">
            {/* Modal for confirmation of deletion */}
            <div className="flex-grow flex flex-col items-center justify-start">
                {showModal && selectedCarousel && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                        {/* Modal content */}   
                        <div className="bg-beige p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                            <h2 className="text-xl font-bold mb-4 text-black">Confirm Deletion</h2>
                            <p className="text-gray-700 mb-6">
                                Are you sure you want to delete carousel number {selectedCarousel.id}?
                            </p>
                            <div className="flex justify-center gap-4">
                                {/* Confirm delete button */}
                                <button
                                    onClick={deleteCarousel}
                                    className="bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold p-4 mr-2 rounded-xl"
                                >
                                    Confirm delete
                                </button>
                                {/* Cancel button */}
                                <button
                                    onClick={() => {
                                        setShowModal(false)
                                        setSelectedCarousel(null)
                                    }}
                                    className="bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold p-4 mr-2 rounded-xl"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Carousel list header */}    
                <div className="grid grid-flow-col grid-cols-12 items-center rounded-3xl md:w-full font-bold text-black">
                    <div className="col-span-1 text-center">Image</div>
                    <div className="col-span-1 text-center">ID</div>
                    <div className="col-span-6 text-center">URL</div>
                    <div className="inline-flex justify-end col-span-4">
                        <a href={`/updateAllCarousels/${contentId}`}>
                            <button className="bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold p-4 rounded-xl">
                                Update all carousels
                            </button>
                        </a>
                        <button onClick={handleAddCarousel} className="bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-4 px-6 mx-2 rounded-xl">
                            <span>+</span>
                        </button>

                    </div>
                </div>              
                {/* Carousel list */}
                {carouselMap()}
                {/* Add carousel form */}
                {addCarousel && (
                    <div key="add-carousel-form" className="grid grid-flow-col gap-1 grid-cols-12 items-center rounded-3xl md:w-full font-bold text-black">
                        <textarea
                            key="add-carousel-textarea"
                            placeholder="Image URL"
                            onChange={handleChange}
                            name="carousel_url"
                            value={formData.carousel_url || ""}
                            className="col-span-6 border border-gray-300 rounded-xl"
                        />
                        {/* Upload button */}
                        {!uploadButton && (<button
                            key="add-carousel-upload-btn"
                            type="button"
                            className="col-span-3 rounded-xl h-full w-full bg-black text-beige hover:bg-opacity-50"
                            onClick={(e) => handleUpload(e, "carousel_url")}
                        >
                            add an image
                        </button>)}
                        {/* Cancel button */}
                        {!uploadButton && (<button
                            key="add-carousel-cancel-btn"
                            type="button"
                            className="col-span-3 rounded-xl h-full w-full bg-black text-beige hover:bg-opacity-50"
                            onClick={() => setAddCarousel(false)}
                        >
                            Cancel
                        </button>)}
                        {/* Edit button */}
                        {uploadButton && (<button
                            key="add-carousel-edit-btn"
                            type="button"
                            className="col-span-2 rounded-xl h-full w-full bg-black text-beige hover:bg-opacity-50"
                            onClick={(e) => handleUpload(e, "carousel_url")}
                        >
                            Edit URL
                        </button>
                        )}
                        {/* Save button */}
                        {uploadButton && (<button
                            key="add-carousel-save-btn"
                            type="button"
                            className="col-span-2 rounded-xl h-full w-full bg-black text-beige hover:bg-opacity-50"
                            onClick={(e) => {
                                handlePost(e)
                            }}
                        >
                            Save
                        </button>
                        )}
                        {/* Cancel button */}
                        {uploadButton && (<button
                            key="add-carousel-cancel-upload-btn"
                            type="button"
                            className="col-span-2 rounded-xl h-full w-full bg-black text-beige hover:bg-opacity-50"
                            onClick={() => {
                                setAddCarousel(false)
                                setFormData({ carousel_url: "" })
                                setUploadButton(false)
                            }}
                        >
                            Cancel
                        </button>
                        )}
                    </div>
                )}
                {/* Return buttons */}
                <div className="flex justify-center mt-10">
                    <a href="/dashboard">
                        <button className="bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold p-4 mr-2 rounded-xl">
                            Return to dashboard
                        </button>
                    </a>
                    <a href={`/EditMainPage`}>
                        <button className="bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold p-4 mr-2 rounded-xl">
                            Return to edit page
                        </button>
                    </a>
                </div>
                {/* Deletion message */}
                {showDeleted && selectedCarousel && (
                    <div className="flex justify-center items-center m-3 p-4 rounded-3xl w-full">
                        <div className="flex items-center gap-4">
                            <h1 className="text-center text-lg font-semibold text-black bg-beige px-6 py-3 rounded-xl">
                                The carousel number {selectedCarousel.id} has been deleted
                            </h1>
                            {/* Dismiss button */}
                            <button
                                onClick={dismissMessage}
                                className="bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 rounded-xl"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </>
}