import React, { SyntheticEvent, useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { baseUrl } from "../config"
import { ICarousels } from "../interfaces/carousels"
import { IContent } from "../interfaces/content"
import { IUser } from "../interfaces/users"
import NotLogged from "./NotLogged"
import { IGrid } from "../interfaces/grid"
import { log } from "console"


interface GridListProps {
    setContent: React.Dispatch<React.SetStateAction<IContent | null>>;
    content: IContent | null;
    grid: IGrid[];
    setGrid: React.Dispatch<React.SetStateAction<IGrid[]>>;
}

interface UserProps {
    user: null | IUser;
    setUser: Function;
}

export default function UpdateGrid({ setContent, content, grid, setGrid, user }: GridListProps & UserProps) {
    console.log(user)
    // State variables
    const [showDeleted, setShowDeleted] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [selectedGrid, setSelectedGrid] = useState<IGrid | null>(null)
    const [addGrid, setAddGrid] = useState(false)
    const [formData, setFormData] = useState<Record<string, string>>({})
    const [uploadButton, setUploadButton] = useState(false)
    const { contentId } = useParams()

    useEffect(() => {
        async function fetchGrid() {
            try {
                const response = await axios.get(`${baseUrl}/content/${contentId}/grid`);
                if (response.data) {
                    setGrid(response.data);
                }
            } catch (error) {
                console.error("Error fetching carousels:", error);
            }
        }
        fetchGrid();
    }, [contentId, setGrid]);

    // Handle input changes
    function handleChange(e: any) {
        const fieldName = e.target.name;
        const newFormData = structuredClone(formData);
        newFormData[fieldName] = e.target.value;
        setFormData(newFormData);
    }

    // Delete a carousel
    async function deleteGrid() {
        if (!selectedGrid) return
        const token = localStorage.getItem("token")
        const gridId = selectedGrid.id;

        try {
            await axios.delete(`${baseUrl}/content/${contentId}/grid/${gridId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            setGrid(prev => prev.filter(grid => grid.id !== gridId))

            setContent(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    grid: prev.grid.filter(grid => grid.id !== gridId)
                }
            });

            setShowDeleted(true)
            setShowModal(false)
        } catch (error) {
            console.error("Delete failed:", error)
            alert("Something went wrong.")
            setShowModal(false)
            setSelectedGrid(null)
        }
    }

    // Dismiss the delete message
    function dismissMessage() {
        setShowDeleted(false)
        setSelectedGrid(null)
    }

    // Handle the upload of a new carousel
    function handleUpload(e: SyntheticEvent, field: string, grid?: IGrid) {
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
                croppingAspectRatio: grid?.width && grid?.height ? grid.width / grid.height : 1,
                croppingCoordinatesMode: "custom",
                showSkipCropButton: false,
                folder: "chez_flo_grid",
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
                        if (grid) {
                            // Update carousels state
                            setGrid(prev => {
                                const newGrid = prev.map(grid =>
                                    grid.id === grid.id
                                        ? { ...grid, grid_url: finalUrl }
                                        : grid
                                );
                                console.log("Updated grid:", newGrid);
                                return newGrid;
                            });

                            // Update content state if it exists
                            if (content) {
                                setContent(prev => {
                                    if (!prev) return null;
                                    const newContent = {
                                        ...prev,
                                        grid: prev.grid.map(grid =>
                                            grid.id === grid.id
                                                ? { ...grid, grid_url: finalUrl }
                                                : grid
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
                `${baseUrl}/content/${contentId}/grid`,
                {
                    grid_url: formData.grid_url
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setGrid(prev => [...prev, response.data]);

            if (content) {
                setContent(prev => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        grid: [...prev.grid, response.data]
                    };
                });
            }

            setFormData({});
            setUploadButton(false);
            setAddGrid(false);
            setShowDeleted(true);
            setTimeout(() => setShowDeleted(false), 3000);

        } catch (err) {
            console.error("Error creating grid:", err);
            alert("Failed to create grid. Please try again.");
        }
    }

    // Handle the update of a carousel
    async function handlePut(e: SyntheticEvent) {
        e.preventDefault();
        if (!selectedGrid) return;
        try {
            const response = await axios.put(
                `${baseUrl}/content/${contentId}/grid/${selectedGrid.id}`,
                {
                    grid_url: formData[`grid_url_${selectedGrid.id}`]
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            if (response.data) {
                // Update grid state with the new data
                setGrid(prev => prev.map(grid =>
                    grid.id === selectedGrid.id ? response.data : grid
                ));

                // Update content state if it exists
                if (content) {
                    setContent(prev => {
                        if (!prev) return null;
                        return {
                            ...prev,
                            grid: prev.grid.map(grid =>
                                grid.id === selectedGrid.id ? response.data : grid
                            )
                        };
                    });
                }
            }

            setFormData({});
            setSelectedGrid(null);
            setShowDeleted(true);
            setTimeout(() => setShowDeleted(false), 3000);

        } catch (err) {
            console.error("Error updating grid:", err);
            alert("Failed to update grid. Please try again.");
        }
    }

    // Map the carousels to the carousel list
    const carouselMap = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {grid?.map((grid: IGrid) => (
                <div
                    key={grid.id}
                    className="bg-black text-beige p-3 sm:p-4 rounded-xl"
                >
                    <div key={`form-${grid.id}`} className="space-y-3">
                        <a
                            href={
                                selectedGrid?.id === grid.id && formData[`grid_url_${grid.id}`]
                                    ? formData[`grid_url_${grid.id}`].toString()
                                    : grid.grid_url
                                        ? grid.grid_url.toString()
                                        : ''
                            }
                            className="block"
                            target="_blank"
                        >
                            <figure key={`figure-${grid.id}`} className="w-full">
                                <img
                                    className="rounded-lg w-full h-32 sm:h-40 object-cover"
                                    src={
                                        selectedGrid?.id === grid.id && formData[`grid_url_${grid.id}`]
                                            ? formData[`grid_url_${grid.id}`].toString()
                                            : grid.grid_url
                                                ? grid.grid_url.toString()
                                                : ''
                                    }
                                    alt="Grid image"
                                />
                            </figure>
                        </a>
                        <div key={`id-${grid.id}`} className="text-center text-sm sm:text-base font-medium">
                            ID: {grid.id}
                        </div>
                        {!(selectedGrid?.id === grid.id && uploadButton) && (
                            <div key={`actions-${grid.id}`} className="space-y-2">
                                <button
                                    key={`update-action-${grid.id}`}
                                    onClick={(e) => {
                                        setSelectedGrid(grid)
                                        handleUpload(e, `grid_url_${grid.id}`, grid)
                                        setUploadButton(false)
                                        setFormData({
                                            [`grid_url_${grid.id}`]: String(grid.grid_url)
                                        })
                                    }}
                                    className="w-full bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-2 px-3 sm:py-3 sm:px-4 rounded-lg text-sm sm:text-base transition-colors"
                                >
                                    Update
                                </button>
                            </div>
                        )}
                        {selectedGrid?.id === grid.id && uploadButton && (
                            <div key={`buttons-${grid.id}`} className="space-y-2">
                                <button
                                    key="add-carousel-edit-btn"
                                    type="button"
                                    className="w-full bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-2 px-3 sm:py-3 sm:px-4 rounded-lg text-sm sm:text-base transition-colors"
                                    onClick={(e) => handleUpload(e, "grid_url", grid)}
                                >
                                    Edit
                                </button>
                                <button
                                    key="add-carousel-save-btn"
                                    type="button"
                                    className="w-full bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-2 px-3 sm:py-3 sm:px-4 rounded-lg text-sm sm:text-base transition-colors"
                                    onClick={(e) => {
                                        handlePut(e)
                                        setAddGrid(false)
                                        setUploadButton(false)
                                    }}
                                >
                                    Save
                                </button>
                                <button
                                    key="add-carousel-cancel-btn"
                                    type="button"
                                    className="w-full bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-2 px-3 sm:py-3 sm:px-4 rounded-lg text-sm sm:text-base transition-colors"
                                    onClick={() => {
                                        if (selectedGrid) {
                                            // Reset the grid back to its original state
                                            setGrid(prev => prev.map(grid =>
                                                grid.id === selectedGrid.id
                                                    ? selectedGrid
                                                    : grid
                                            ));
                                            // Also update content state if it exists
                                            if (content) {
                                                setContent(prev => {
                                                    if (!prev) return null;
                                                    return {
                                                        ...prev,
                                                        grid: prev.grid.map(grid =>
                                                            grid.id === selectedGrid.id
                                                                ? selectedGrid
                                                                : grid
                                                        )
                                                    };
                                                });
                                            }
                                        }
                                        setAddGrid(false)
                                        setUploadButton(false)
                                        setSelectedGrid(null)
                                        setFormData({})
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )

    // Render the component
    return (
        (user ? <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8 lg:p-12">
            {showModal && selectedGrid && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
                    <div className="bg-beige p-6 sm:p-8 rounded-2xl shadow-xl max-w-sm sm:max-w-md w-full text-center">
                        <h2 className="text-lg sm:text-xl font-bold mb-4 text-black">Confirm Deletion</h2>
                        <p className="text-gray-700 mb-6 text-sm sm:text-base">
                            Are you sure you want to delete{" "}
                            <strong>
                                {selectedGrid.id}
                            </strong>
                            ?
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                            <button
                                onClick={() => {
                                    deleteGrid()
                                    setShowModal(false)
                                    setShowDeleted(false)
                                }}
                                className="bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-3 px-4 rounded-xl text-sm sm:text-base transition-colors"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-3 px-4 rounded-xl text-sm sm:text-base transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-black">Grid Management</h1>

                {/* Grid Items */}
                {carouselMap()}

                {/* Add Grid Form */}
                {addGrid && (
                    <div key="add-carousel-form" className="bg-black text-beige p-4 sm:p-6 rounded-xl mt-6">
                        <h2 className="text-lg sm:text-xl font-bold mb-4">Add New Grid Item</h2>
                        <div className="space-y-4">
                            {!uploadButton && (
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        key="add-carousel-upload-btn"
                                        type="button"
                                        className="flex-1 bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-3 px-4 rounded-lg text-sm sm:text-base transition-colors"
                                        onClick={(e) => handleUpload(e, "grid_url")}
                                    >
                                        Upload Image
                                    </button>
                                    <button
                                        key="add-carousel-cancel-btn"
                                        type="button"
                                        className="flex-1 bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-3 px-4 rounded-lg text-sm sm:text-base transition-colors"
                                        onClick={() => {
                                            setAddGrid(false)
                                            setFormData({ grid_url: "" })
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
                                    <a href={formData.grid_url ? formData.grid_url.toString() : ''} className="block" target="_blank">
                                        <figure key={`figure-${formData.grid_url}`} className="w-full">
                                            <img
                                                className="rounded-lg w-full h-48 sm:h-64 object-cover"
                                                src={formData.grid_url ? formData.grid_url.toString() : ''}
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
                                        onClick={(e) => handleUpload(e, "grid_url")}
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
                                            setAddGrid(false)
                                            setFormData({ grid_url: "" })
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
                        <button className="w-full sm:w-auto bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-3 px-6 rounded-xl text-sm sm:text-base transition-colors">
                            Return to Dashboard
                        </button>
                    </a>
                    <a href={`/EditMainPage`} className="flex-1 sm:flex-none">
                        <button className="w-full sm:w-auto bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-3 px-6 rounded-xl text-sm sm:text-base transition-colors">
                            Return to Edit Page
                        </button>
                    </a>
                </div>

                {/* Success Message */}
                {showDeleted && selectedGrid && (
                    <div className="flex justify-center items-center mt-6">
                        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-beige px-4 py-3 rounded-xl">
                            <h1 className="text-center text-sm sm:text-base font-semibold text-black">
                                Grid item {selectedGrid.id} has been deleted
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
        </div> :
            <NotLogged />
        )
    );
}