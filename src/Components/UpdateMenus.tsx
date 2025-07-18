import React, { SyntheticEvent, useState } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"
import { baseUrl } from "../config"
import { IUser } from "../interfaces/users"
import { IContent } from "../interfaces/content"
import { IMenus } from "../interfaces/menus"
import NotLogged from "./NotLogged"

interface ContentProps {
    content: null | IContent;
    setContent: Function;
    menus: IMenus[];
    setMenus: Function;
}
interface UserProps {
    user: null | IUser;
    setUser: Function;
}

export default function UpdateMenus({ content, setContent, menus, setMenus, user, setUser }: ContentProps & UserProps) {
    console.log(user)
    const [showDeleted, setShowDeleted] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState<Record<string, string>>({})
    const [uploadButton, setUploadButton] = useState(false)
    const [showUpdateForm, setShowUpdateForm] = useState(false)
    const [selectedMenu, setSelectedMenu] = useState<IMenus | null>(null)
    const [addMenu, setAddMenu] = useState(false)

    // Get the contentId from the URL
    const { contentId } = useParams()

    // Add a menu fuction
    async function handlePost(e: SyntheticEvent) {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${baseUrl}/content/${contentId}/menus`,
                {
                    menus_url: formData.menus_url,
                    menus_type: formData.menus_type,
                    menus_text: capitalise(formData.menus_type) // Capitalize the menu type for the text
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            console.log("Menu created:", response.data); // Add logging to debug

            setMenus((prev: any) => [...prev, response.data]);

            if (menus) {
                setContent((prev: { menus: any }) => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        menus: [...prev.menus, response.data]
                    };
                });
            }

            setFormData({});
            setUploadButton(false);
            setAddMenu(false);
            setShowDeleted(true);
            setTimeout(() => setShowDeleted(false), 3000);

        } catch (err) {
            console.error("Error creating menu:", err);
            alert("Failed to create menu. Please try again.");
        }
    }

    // Helper function to capitalize text
    function capitalise(text: string): string {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }

    // Handle the addition of a new menu
    const handleAddMenu = () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth',
        });
        setAddMenu(true)
    }

    // Handle input changes
    function handleChange(e: any) {
        const fieldName = e.target.name;
        const newFormData = structuredClone(formData);
        newFormData[fieldName] = e.target.value;
        setFormData(newFormData);
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
                resourceType: "raw", // Very important: PDFs are raw files
                clientAllowedFormats: ["pdf"], // Only accept PDFs
                multiple: false,
                maxFiles: 1,
                folder: "chez_flo_menus",
                // No transformations or cropping here
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
            (error: any, result: { event: string; info: { secure_url: string; public_id: string } }) => {
                if (error) {
                    console.error("Cloudinary Upload Error:", error);
                    return;
                }
                if (result && result.event === "success") {
                    console.log("Uploaded URL:", result.info.secure_url);
                    console.log("Public ID:", result.info.public_id);
                    if (selectedMenu) {
                        setFormData(prev => ({
                            ...prev,
                            [`menus_url_${selectedMenu.id}`]: result.info.secure_url
                        }));
                    } else {
                        setFormData(prev => ({
                            ...prev,
                            menus_url: result.info.secure_url
                        }));
                    }
                    setUploadButton(true);
                }
            }
        );

        widget.open();
    }

    // Update a menu function
    async function handlePut(e: SyntheticEvent) {
        e.preventDefault();
        if (!selectedMenu) return;
        try {
            const response = await axios.put(
                `${baseUrl}/content/${contentId}/menus/${selectedMenu.menus_type}`,
                {
                    menus_url: formData[`menus_url_${selectedMenu.id}`],
                    menus_type: formData[`menus_type_${selectedMenu.id}`],
                    menus_text: formData[`menus_text_${selectedMenu.id}`]
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            if (response.data) {
                setMenus((prev: any[]) => prev.map((menu: { id: string }) =>
                    menu.id === selectedMenu.id ? response.data : menu
                ));

                if (content) {
                    setContent((prev: { menus: any[] }) => {
                        if (!prev) return null;
                        return {
                            ...prev,
                            menus: prev.menus.map((menu: { id: string }) =>
                                menu.id === selectedMenu.id ? response.data : menu
                            )
                        };
                    });
                }
            }

            setFormData({});
            setShowUpdateForm(false);
            setSelectedMenu(null);
            setShowDeleted(true);
            setTimeout(() => setShowDeleted(false), 3000);

        } catch (err) {
            console.error("Error updating menu:", err);
            alert("Failed to update menu. Please try again.");
        }
    }

    // Delete a menu function
    async function deleteMenus() {
        if (!selectedMenu) return
        const token = localStorage.getItem("token")


        try {
            await axios.delete(`${baseUrl}/content/${contentId}/menus/${selectedMenu.menus_type}`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            setMenus((prev: any[]) => prev.filter((menu: { id: string }) => menu.id !== selectedMenu.id))
            setShowDeleted(true)
            setShowModal(false)
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth',
            });
        } catch (error) {
            console.error("Delete failed:", error)
            alert("Something went wrong.")
        }
    }

    // Dismiss message function
    function dismissMessage() {
        setShowDeleted(false)
        setSelectedMenu(null)
    }

    // map the menus to the menu list
    const menuMap = () => {
        // Define the desired order of menu types
        const menuOrder = [
            'breakfast',
            'lunch',
            'dinner',
            'wine',
            'dessert',
            'cocktails'
        ];

        // Sort the menus based on the defined order
        const sortedMenus = [...menus].sort((a, b) => {
            const indexA = menuOrder.indexOf(a.menus_type.toLowerCase());
            const indexB = menuOrder.indexOf(b.menus_type.toLowerCase());

            // If both types are in the order list, sort by their position
            if (indexA !== -1 && indexB !== -1) {
                return indexA - indexB;
            }

            // If only one type is in the order list, prioritize it
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;

            // If neither type is in the order list, sort alphabetically
            return a.menus_type.localeCompare(b.menus_type);
        });

        return sortedMenus.map((menu: IMenus) => (
            <div
                key={menu.id}
                className="bg-black text-beige my-2 p-3 md:p-4 rounded-xl"
            >
                {selectedMenu?.id === menu.id && showUpdateForm ? (
                    <div key={`form-${menu.id}`} className="space-y-3 md:space-y-4">
                        <div className="w-full md:w-32 h-40">
                            <iframe
                                src={menu.menus_url ? menu.menus_url.toString() : ''}
                                className="w-full h-full rounded-xl border-4 border-black cursor-pointer hover:border-beige transition-all duration-200"
                                title={`${menu.menus_type} menu preview`}
                                onClick={() => window.open(menu.menus_url ? menu.menus_url.toString() : '', '_blank')}
                            />
                        </div>
                        <form key={`form-inner-${menu.id}`} className="space-y-3 md:space-y-4">
                            <textarea
                                key={`textarea-${menu.id}`}
                                placeholder="Menu name"
                                onChange={handleChange}
                                name={`menus_text_${menu.id}`}
                                value={formData[`menus_text_${menu.id}`] || ""}
                                className="text-black border border-gray-300 rounded-xl p-2 w-full text-sm md:text-base"
                            />
                            <textarea
                                key={`textarea-${menu.id}`}
                                placeholder="To add a PDF, please click on the add a menu button"
                                onChange={handleChange}
                                name={`menus_url_${menu.id}`}
                                value={formData[`menus_url_${menu.id}`] || ""}
                                className="text-black border border-gray-300 rounded-xl p-2 w-full bg-beige text-sm md:text-base"
                                disabled={true}
                            />
                            <div key={`buttons-${menu.id}`} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <button
                                    key={`upload-btn-${menu.id}`}
                                    onClick={(e) => {
                                        handleUpload(e, `menu_${menu.id}`)
                                        setShowUpdateForm(true)
                                        setUploadButton(false)
                                    }}
                                    type="submit"
                                    className="w-full bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 rounded-xl text-sm md:text-base"
                                >
                                    Edit Menu
                                </button>
                                <button
                                    key={`save-btn-${menu.id}`}
                                    type="button"
                                    onClick={(e) => {
                                        handlePut(e)
                                        setShowUpdateForm(false)
                                        setUploadButton(false)
                                    }}
                                    className="w-full bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 rounded-xl text-sm md:text-base"
                                >
                                    Save
                                </button>
                                <button
                                    key={`cancel-btn-${menu.id}`}
                                    onClick={() => setShowUpdateForm(false)}
                                    type="button"
                                    className="w-full bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 rounded-xl text-sm md:text-base"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center">
                        <div className="w-full md:w-32 h-40 flex justify-center items-center">
                            <iframe
                                src={menu.menus_url ? menu.menus_url.toString() : ''}
                                className="w-full h-full rounded-xl border-4 border-black cursor-pointer hover:border-beige transition-all duration-200"
                                title={`${menu.menus_text} menu preview`}
                                onClick={() => window.open(menu.menus_url ? menu.menus_url.toString() : '', '_blank')}
                            />
                        </div>
                        <a href={menu.menus_url ? menu.menus_url.toString() : ''} className="md:col-span-8" target="_blank">
                            <div key={`id-${menu.id}`} className="text-center text-sm md:text-base">{menu.menus_text}</div>
                        </a>
                        <div key={`buttons-${menu.id}`} className="grid grid-cols-1 md:grid-cols-2 gap-2 md:col-span-3">
                            {!(selectedMenu?.id === menu.id && showUpdateForm) && (
                                <>
                                    <button
                                        key={`update-action-${menu.id}`}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            setSelectedMenu(menu)
                                            setShowUpdateForm(true)
                                            setFormData({
                                                [`menus_url_${menu.id}`]: String(menu.menus_url),
                                                [`menus_type_${menu.id}`]: menu.menus_type,
                                                [`menus_text_${menu.id}`]: menu.menus_text
                                            })
                                        }}
                                        className="h-16 md:h-24 w-full bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 rounded-xl text-sm md:text-base"
                                    >
                                        Update
                                    </button>
                                    <button
                                        key={`delete-action-${menu.id}`}
                                        onClick={() => {
                                            setSelectedMenu(menu)
                                            setShowModal(true)
                                            setShowDeleted(false)
                                        }}
                                        className="h-16 md:h-24 w-full bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 rounded-xl text-sm md:text-base"
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div >
        ))
    }

    // Render the component
    return (<>
        {(user ? <div className="min-h-screen bg-white px-4 py-8 md:py-12">
            <div className="max-w-7xl mx-auto">
                {showModal && selectedMenu && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                        {/* Modal content */}
                        <div className="bg-beige p-6 md:p-8 rounded-2xl shadow-xl max-w-md w-full mx-4 text-center">
                            <h2 className="text-lg md:text-xl font-bold mb-4 text-black">Confirm Deletion</h2>
                            <p className="text-sm md:text-base text-gray-700 mb-6">
                                Are you sure you want to delete {selectedMenu.menus_text} menu  ?
                            </p>
                            <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-4">
                                {/* Confirm delete button */}
                                <button
                                    onClick={deleteMenus}
                                    className="w-full md:w-auto bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold p-3 md:p-4 rounded-xl text-sm md:text-base"
                                >
                                    Confirm delete
                                </button>
                                {/* Cancel button */}
                                <button
                                    onClick={() => {
                                        setShowModal(false)
                                        setSelectedMenu(null)
                                    }}
                                    className="w-full md:w-auto bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold p-3 md:p-4 rounded-xl text-sm md:text-base"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="text-center mb-6 md:mb-8">
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-black mb-2 md:mb-4">Menus list</h1>
                    <p className="text-sm md:text-base text-gray-700">
                        To see menus, please click on the menu name.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 items-center rounded-xl md:rounded-3xl w-full font-bold text-black mb-4 p-3 md:p-4">
                    <div className="col-span-1 md:col-span-2 text-sm md:text-base">Preview</div>
                    <div className="col-span-1 md:col-span-8 text-center text-sm md:text-base">Name</div>
                    <div className="col-span-1 md:col-span-2 flex justify-end">
                        <button
                            onClick={handleAddMenu}
                            className="bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 md:py-4 px-3 md:px-6 rounded-xl text-sm md:text-base">
                            <span>+</span>
                        </button>
                    </div>
                </div>
                <div className="space-y-3 md:space-y-4">
                    {menuMap()}
                </div>
                {addMenu && (
                    <div key="add-menu-form" className="bg-black my-2 p-3 md:p-4 rounded-xl font-bold text-black">
                        <div className="space-y-3 md:space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                <textarea
                                    key="add-menu-textarea"
                                    placeholder="Menu name"
                                    onChange={handleChange}
                                    name="menus_type"
                                    value={formData.menus_type || ""}
                                    className="border border-gray-300 rounded-xl p-2 h-20 md:h-24 text-sm md:text-base"
                                />
                                <textarea
                                    key="add-menu-textarea"
                                    placeholder="To add a PDF, please click on the add a menu button"
                                    onChange={handleChange}
                                    name="menus_url"
                                    value={formData.menus_url || ""}
                                    className="border border-gray-300 rounded-xl p-2 h-20 md:h-24 bg-beige text-sm md:text-base"
                                    disabled={true}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
                                {!uploadButton && (
                                    <>
                                        <button
                                            key="add-menu-upload-btn"
                                            type="button"
                                            className="h-10 md:h-12 bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 rounded-xl text-sm md:text-base"
                                            onClick={(e) => handleUpload(e, "menus_url")}
                                        >
                                            Add a menu
                                        </button>
                                        <button
                                            key="add-menu-cancel-btn"
                                            type="button"
                                            className="h-10 md:h-12 bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 rounded-xl text-sm md:text-base"
                                            onClick={() => {
                                                setAddMenu(false)
                                                setFormData({ menus_url: "", menus_type: "" })
                                                setUploadButton(false)
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                                {uploadButton && (
                                    <>
                                        <button
                                            key="add-menu-edit-btn"
                                            type="button"
                                            className="h-10 md:h-12 bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 rounded-xl text-sm md:text-base"
                                            onClick={(e) => handleUpload(e, "menus_url")}
                                        >
                                            Edit URL
                                        </button>
                                        <button
                                            key="add-menu-save-btn"
                                            type="button"
                                            className="h-10 md:h-12 bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 rounded-xl text-sm md:text-base"
                                            onClick={(e) => {
                                                handlePost(e)
                                            }}
                                        >
                                            Save
                                        </button>
                                        <button
                                            key="add-menu-cancel-btn"
                                            type="button"
                                            className="h-10 md:h-12 bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 rounded-xl text-sm md:text-base"
                                            onClick={() => {
                                                setAddMenu(false)
                                                setFormData({ menus_url: "", menus_type: "" })
                                                setUploadButton(false)
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {/* Return buttons */}
                <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-4 mt-8 md:mt-10">
                    <a href="/dashboard">
                        <button className="w-full md:w-auto bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold p-3 md:p-4 rounded-xl text-sm md:text-base">
                            Return to dashboard
                        </button>
                    </a>
                    <a href={`/EditMainPage`}>
                        <button className="w-full md:w-auto bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold p-3 md:p-4 rounded-xl text-sm md:text-base">
                            Return to edit page
                        </button>
                    </a>
                </div>
                {/* Deletion message */}
                {showDeleted && selectedMenu && (
                    <div className="flex flex-col md:flex-row justify-center items-center m-3 p-4 rounded-xl md:rounded-3xl w-full">
                        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
                            <h1 className="text-center text-base md:text-lg font-semibold text-black bg-beige px-4 md:px-6 py-3 rounded-xl">
                                The {selectedMenu.menus_text} menu has been deleted
                            </h1>
                            {/* Dismiss button */}
                            <button
                                onClick={dismissMessage}
                                className="bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 rounded-xl text-sm md:text-base"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div> :
            <NotLogged />
        )}
    </>
    )
}
