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

    // Add this useEffect to debug selectedGrid changes
    useEffect(() => {
        console.log("selectedGrid updated:", selectedGrid)
    }, [selectedGrid])

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

    // Scroll to the bottom of the page when adding a new carousel
    const handleAddGrid = () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth',
        });
        setAddGrid(true)
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
                    console.log(grid)
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
        <div className="grid grid-cols-2 gap-4">
            {grid?.map((grid: IGrid) => (
                <div
                    key={grid.id}
                    className="bg-black text-beige grid grid-flow-col my-2 p-2 items-center rounded-xl"
                >
                    <div key={`form-${grid.id}`} className="col-span-12 grid grid-cols-12 gap-2 items-center">
                        <a
                            href={
                                selectedGrid?.id === grid.id && formData[`grid_url_${grid.id}`]
                                    ? formData[`grid_url_${grid.id}`].toString()
                                    : grid.grid_url
                                        ? grid.grid_url.toString()
                                        : ''
                            }
                            className="col-span-5"
                            target="_blank"
                        >
                            <figure key={`figure-${grid.id}`} className="w-full">
                                <img
                                    className="rounded-xl h-full w-40 object-cover"
                                    src={
                                        selectedGrid?.id === grid.id && formData[`grid_url_${grid.id}`]
                                            ? formData[`grid_url_${grid.id}`].toString()
                                            : grid.grid_url
                                                ? grid.grid_url.toString()
                                                : ''
                                    }
                                    alt="Placeholder image"
                                />
                            </figure>
                        </a>
                        <div key={`id-${grid.id}`} className="col-span-5 text-center">{grid.id}</div>
                        {!(selectedGrid?.id === grid.id && uploadButton) && (
                            // pre widget buttons
                            <div key={`actions-${grid.id}`} className="col-span-2 grid grid-cols-1 gap-2">
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
                                    className="h-28 w-full bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 rounded-xl"
                                >
                                    Update
                                </button>
                            </div>
                        )}
                        {selectedGrid?.id === grid.id && uploadButton && (
                            // post widget buttons
                            <div key={`buttons-${grid.id}`} className="col-span-2 grid grid-cols-1 gap-2">
                                <>
                                    <button
                                        key="add-carousel-edit-btn"
                                        type="button"
                                        className="h-10 bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 rounded-xl col-span-2"
                                        onClick={(e) => handleUpload(e, "grid_url", grid)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        key="add-carousel-save-btn"
                                        type="button"
                                        className="h-10 bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 rounded-xl col-span-2"
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
                                        className="h-10 bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 rounded-xl col-span-2"
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
                                </>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )

    // Render the component
    return (
        (user ? <div className="flex flex-col bg-white m-36">
            {showModal && selectedGrid && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                    <div className="bg-beige p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                        <h2 className="text-xl font-bold mb-4 text-black">Confirm Deletion</h2>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete{" "}
                            <strong>
                                {selectedGrid.id}
                            </strong>
                            ?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => {
                                    deleteGrid()
                                    setShowModal(false)
                                    setShowDeleted(false)
                                }}
                                className="bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold p-4 mr-2 rounded-xl"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold p-4 mr-2 rounded-xl"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <h1 className="text-2xl font-bold mb-4 text-black">Grid list</h1>
            <div className="flex">   
            <div className="grid grid-flow-col grid-cols-12 items-center rounded-3xl md:w-full font-bold text-black">
                <div className="col-span-5 pl-14">Preview</div>
                <div className="col-span-5 text-center">ID</div>
                {/* <div className="inline-flex justify-end col-span-4">
                    <button
                        onClick={handleAddGrid}
                        className="bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-4 px-6 mx-2 rounded-xl">
                        <span>+</span>
                    </button>
                </div> */}
            </div>
            <div className="grid grid-flow-col grid-cols-12 items-center rounded-3xl md:w-full font-bold text-black">
                <div className="col-span-5 pl-14">Preview</div>
                <div className="col-span-5 text-center">ID</div>
                {/* <div className="inline-flex justify-end col-span-4">
                    <button
                        onClick={handleAddGrid}
                        className="bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-4 px-6 mx-2 rounded-xl">
                        <span>+</span>
                    </button>
                </div> */}
            </div>
            </div>
            {carouselMap()}
            {addGrid && (
                <div key="add-carousel-form" className="bg-black grid-flow-row my-2 p-2 grid grid-cols-12 gap-4 items-center rounded-xl md:w-full font-bold text-black">
                    <div className="col-span-12 grid grid-cols-12 gap-2">
                        {!uploadButton && (
                            <>
                                <button
                                    key="add-carousel-upload-btn"
                                    type="button"
                                    className="h-12 bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 rounded-xl col-span-6"
                                    onClick={(e) => handleUpload(e, "grid_url")}
                                >
                                    add an image
                                </button>
                                <button
                                    key="add-carousel-cancel-btn"
                                    type="button"
                                    className="h-12 bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 rounded-xl col-span-6"
                                    onClick={() => {
                                        setAddGrid(false)
                                        setFormData({ grid_url: "" })
                                        setUploadButton(false)
                                    }}
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                    {uploadButton && (
                        <>
                            <div className="col-span-12 grid grid-cols-12 justify-center items-center">
                                <a href={formData.grid_url ? formData.grid_url.toString() : ''} className="col-span-12" target="_blank">
                                    <figure key={`figure-${formData.grid_url}`} className="w-full">
                                        <img
                                            className="rounded-xl h-full w-full object-cover"
                                            src={formData.grid_url ? formData.grid_url.toString() : ''}
                                            alt="Placeholder image"
                                        /> x
                                    </figure>
                                </a>
                            </div>
                            <div className="col-span-12 grid grid-cols-12 justify-center items-center gap-2">
                                <button
                                    key="add-carousel-edit-btn"
                                    type="button"
                                    className="h-12 bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 rounded-xl col-span-4"
                                    onClick={(e) => handleUpload(e, "grid_url")}
                                >
                                    Edit URL
                                </button>
                                <button
                                    key="add-carousel-save-btn"
                                    type="button"
                                    className="h-12 bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 rounded-xl col-span-4"
                                    onClick={(e) => {
                                        handlePost(e)
                                    }}
                                >
                                    Save
                                </button>
                                <button
                                    key="add-carousel-cancel-btn"
                                    type="button"
                                    className="h-12 bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 rounded-xl col-span-4"
                                    onClick={() => {
                                        setAddGrid(false)
                                        setFormData({ grid_url: "" })
                                        setUploadButton(false)
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
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
            {showDeleted && selectedGrid && (
                <div className="flex justify-center items-center m-3 p-4 rounded-3xl w-full">
                    <div className="flex items-center gap-4">
                        <h1 className="text-center text-lg font-semibold text-black bg-beige px-6 py-3 rounded-xl">
                            The grid number {selectedGrid.id} has been deleted
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
        </div> :
            <NotLogged />
        )
    );
}