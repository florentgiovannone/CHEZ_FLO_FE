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
                    menus_text: capitalise(formData.menus_type), // Capitalize the menu type for the text
                    scheduled_at: formData.scheduled_at || null,
                    scheduled_text: formData.scheduled_text || "",
                    scheduled_url: formData.scheduled_url || "",
                    applied: false
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

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

    // Helper function to format date in custom format
    function formatCustomDate(dateInput: string | Date): string {
        const date = new Date(dateInput);

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

        const dayName = days[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        // Get ordinal suffix
        const getOrdinalSuffix = (n: number): string => {
            if (n >= 11 && n <= 13) return 'th';
            switch (n % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };

        const ordinalDay = `${day}${getOrdinalSuffix(day)}`;

        return `${dayName} ${ordinalDay} of ${month} ${year} at ${hours}:${minutes} BST`;
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

        // Check if any changes have been made
        const currentMenuText = formData[`menus_text_${selectedMenu.id}`];
        const currentMenuUrl = formData[`menus_url_${selectedMenu.id}`];
        const currentMenuType = formData[`menus_type_${selectedMenu.id}`];
        const scheduledAt = formData[`scheduled_at_${selectedMenu.id}`];

        const hasTextChanged = currentMenuText && currentMenuText !== selectedMenu.menus_text;
        const hasUrlChanged = currentMenuUrl && currentMenuUrl !== selectedMenu.menus_url;
        const hasTypeChanged = currentMenuType && currentMenuType !== selectedMenu.menus_type;
        const hasScheduledDate = scheduledAt && scheduledAt.trim() !== '';

        // If no content changes have been made (only checking actual content, not scheduled date), show alert and return
        if (!hasTextChanged && !hasUrlChanged && !hasTypeChanged) {
            alert("Please edit the file before saving");
            return;
        }

        try {
            const isScheduled = scheduledAt && new Date(scheduledAt) > new Date();

            // Prepare data based on whether it's scheduled or immediate
            const updateData: any = {
                menus_text: formData[`menus_text_${selectedMenu.id}`],
                menus_url: formData[`menus_url_${selectedMenu.id}`] || selectedMenu.menus_url,
                menus_type: formData[`menus_type_${selectedMenu.id}`] || selectedMenu.menus_type,
            };

            // Add scheduled_at only if it's a future date
            if (isScheduled) {
                updateData.scheduled_at = scheduledAt;
            }

            const response = await axios.put(
                `${baseUrl}/content/${contentId}/menus/${selectedMenu.menus_type}`,
                updateData,
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

            // Show success message
            const successMessage = isScheduled
                ? `Menu update scheduled for ${formatCustomDate(scheduledAt)}`
                : 'Menu updated immediately';
            alert(successMessage);

            setFormData({});
            setShowUpdateForm(false);
            setSelectedMenu(null);
            setShowDeleted(true);
            setTimeout(() => setShowDeleted(false), 3000);

        } catch (err: any) {
            console.error("Error updating menu:", err);
            console.error("Error response:", err.response?.data);
            const errorMessage = err.response?.data?.message || err.message || "Failed to update menu. Please try again.";
            alert(`Error: ${errorMessage}`);
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

        // Filter out any invalid menu items
        const validMenus = menus.filter(menu =>
            menu &&
            typeof menu === 'object' &&
            menu.id &&
            menu.menus_type !== undefined &&
            menu.menus_type !== null
        );

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
        const sortedMenus = [...validMenus].sort((a, b) => {
            // Safety check: ensure menus_type exists and is a string
            const typeA = a.menus_type?.toLowerCase() || '';
            const typeB = b.menus_type?.toLowerCase() || '';

            const indexA = menuOrder.indexOf(typeA);
            const indexB = menuOrder.indexOf(typeB);

            // If both types are in the order list, sort by their position
            if (indexA !== -1 && indexB !== -1) {
                return indexA - indexB;
            }

            // If only one type is in the order list, prioritize it
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;

            // If neither type is in the order list, sort alphabetically
            return typeA.localeCompare(typeB);
        });

        return sortedMenus.map((menu: IMenus) => (
            <div
                key={menu.id}
                className="bg-black text-beige p-3 sm:p-4 rounded-xl"
            >
                {selectedMenu?.id === menu.id && showUpdateForm ? (
                    <div key={`form-${menu.id}`} className="space-y-3">
                        <div className="w-full h-70">
                            <iframe
                                src={menu.menus_url ? menu.menus_url.toString() : ''}
                                className="w-full h-full rounded-lg border-4 border-black cursor-pointer hover:border-beige transition-all duration-200"
                                title={`${menu.menus_type} menu preview`}
                                onClick={() => window.open(menu.menus_url ? menu.menus_url.toString() : '', '_blank')}
                            />
                        </div>
                        <form key={`form-inner-${menu.id}`} className="space-y-3">
                            <input
                                key={`textarea-${menu.id}`}
                                placeholder="Menu name"
                                onChange={handleChange}
                                name={`menus_text_${menu.id}`}
                                value={formData[`menus_text_${menu.id}`] || ""}
                                className="text-black border border-gray-300 rounded-lg p-3 w-full h-12 text-sm sm:text-base focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                            />
                            <div key={`schedule-${menu.id}`} className="flex flex-col gap-2">
                                <label htmlFor={`scheduled_at_${menu.id}`} className="text-sm font-semibold">
                                    Schedule for:
                                </label>
                                <input
                                    type="datetime-local"
                                    id={`scheduled_at_${menu.id}`}
                                    name={`scheduled_at_${menu.id}`}
                                    value={formData[`scheduled_at_${menu.id}`] || ""}
                                    onChange={handleChange}
                                    className="w-full bg-beige text-black border border-gray-300 rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                                    min={new Date().toISOString().slice(0, 16)} // Prevent selecting past dates
                                />
                                <small className="text-gray-600">
                                    Leave empty to publish immediately, or select a future date/time to schedule
                                </small>
                            </div>
                            <div key={`buttons-${menu.id}`} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <button
                                    key={`upload-btn-${menu.id}`}
                                    onClick={(e) => {
                                        handleUpload(e, `menu_${menu.id}`)
                                        setShowUpdateForm(true)
                                        setUploadButton(false)
                                    }}
                                    type="submit"
                                    className="w-full bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-2 px-3 sm:py-3 sm:px-4 rounded-lg text-sm sm:text-base transition-colors"
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
                                    className="w-full bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-2 px-3 sm:py-3 sm:px-4 rounded-lg text-sm sm:text-base transition-colors"
                                >
                                    Save
                                </button>
                                <button
                                    key={`cancel-btn-${menu.id}`}
                                    onClick={() => setShowUpdateForm(false)}
                                    type="button"
                                    className="w-full bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-2 px-3 sm:py-3 sm:px-4 rounded-lg text-sm sm:text-base transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="flex flex-col h-full">
                        <div className="flex-grow space-y-3">
                            <div className="w-full h-40 flex justify-center items-center">
                                <iframe
                                    src={menu.menus_url ? menu.menus_url.toString() : ''}
                                    className="w-full h-full rounded-lg border-4 border-black cursor-pointer hover:border-beige transition-all duration-200"
                                    title={`${menu.menus_text} menu preview`}
                                    onClick={() => window.open(menu.menus_url ? menu.menus_url.toString() : '', '_blank')}
                                />
                            </div>
                            <a href={menu.menus_url ? menu.menus_url.toString() : ''} className="block" target="_blank">
                                <div key={`id-${menu.id}`} className="text-center text-sm sm:text-base font-medium">
                                    {menu.menus_text}
                                </div>
                                <div key={`ids-${menu.id}`} className="text-center text-sm sm:text-base font-medium">
                                    {menu.scheduled_at ? `Change scheduled for: ${formatCustomDate(menu.scheduled_at)}` : 'Not scheduled'}
                                </div>
                            </a>
                        </div>
                        {!(selectedMenu?.id === menu.id && showUpdateForm) && (
                            <div className="space-y-2 mt-auto">
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
                                    className="w-full bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-2 px-3 sm:py-3 sm:px-4 rounded-lg text-sm sm:text-base transition-colors"
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
                                    className="w-full bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-2 px-3 sm:py-3 sm:px-4 rounded-lg text-sm sm:text-base transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        ))
    }

    // Render the component
    return (
        user ? (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-black">
                            Menu Management
                        </h1>

                        <p className="text-sm sm:text-base text-gray-600 mb-6">
                            To see menus, please click on the menu name.
                        </p>

                        {/* Add Menu Button */}
                        <div className="mb-6">
                            <button
                                onClick={handleAddMenu}
                                className="bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-3 px-6 rounded-xl text-sm sm:text-base transition-colors"
                            >
                                + Add New Menu
                            </button>
                        </div>

                        {/* Menu List */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            {menuMap()}
                        </div>

                        {/* Add Menu Form */}
                        {addMenu && (
                            <div key="add-menu-form" className="bg-black text-beige p-4 sm:p-6 rounded-xl mt-6">
                                <h2 className="text-lg sm:text-xl font-bold mb-4">Add New Menu</h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm sm:text-base font-semibold text-beige">
                                                Menu Name
                                            </label>
                                            <textarea
                                                key="add-menu-textarea"
                                                placeholder="Enter menu name"
                                                onChange={handleChange}
                                                name="menus_type"
                                                value={formData.menus_type || ""}
                                                className="border border-gray-300 rounded-lg p-3 h-20 text-sm sm:text-base focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm sm:text-base font-semibold text-beige">
                                                PDF URL
                                            </label>
                                            <textarea
                                                key="add-menu-textarea"
                                                placeholder="To add a PDF, please click on the upload button"
                                                onChange={handleChange}
                                                name="menus_url"
                                                value={formData.menus_url || ""}
                                                className="border border-gray-300 rounded-lg p-3 h-20 bg-beige text-sm sm:text-base focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                                                disabled={true}
                                            />
                                        </div>
                                    </div>

                                    {/* Schedule Date/Time */}
                                    <div className="space-y-2">
                                        <label className="text-sm sm:text-base font-semibold text-beige">
                                            Schedule for (optional)
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="scheduled_at"
                                            value={formData.scheduled_at || ""}
                                            onChange={handleChange}
                                            className="w-full bg-beige text-black border border-gray-300 rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                                            min={new Date().toISOString().slice(0, 16)}
                                        />
                                        <small className="text-gray-400">
                                            Leave empty to publish immediately, or select a future date/time to schedule
                                        </small>
                                    </div>

                                    {!uploadButton && (
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <button
                                                key="add-menu-upload-btn"
                                                type="button"
                                                className="flex-1 bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-3 px-4 rounded-lg text-sm sm:text-base transition-colors"
                                                onClick={(e) => handleUpload(e, "menus_url")}
                                            >
                                                Upload PDF
                                            </button>
                                            <button
                                                key="add-menu-cancel-btn"
                                                type="button"
                                                className="flex-1 bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-3 px-4 rounded-lg text-sm sm:text-base transition-colors"
                                                onClick={() => {
                                                    setAddMenu(false)
                                                    setFormData({ menus_url: "", menus_type: "" })
                                                    setUploadButton(false)
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                    {uploadButton && (
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <button
                                                key="add-menu-edit-btn"
                                                type="button"
                                                className="bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-3 px-4 rounded-lg text-sm sm:text-base transition-colors"
                                                onClick={(e) => handleUpload(e, "menus_url")}
                                            >
                                                Edit PDF
                                            </button>
                                            <button
                                                key="add-menu-save-btn"
                                                type="button"
                                                className="bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-3 px-4 rounded-lg text-sm sm:text-base transition-colors"
                                                onClick={(e) => {
                                                    handlePost(e)
                                                }}
                                            >
                                                Save
                                            </button>
                                            <button
                                                key="add-menu-cancel-btn"
                                                type="button"
                                                className="bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-3 px-4 rounded-lg text-sm sm:text-base transition-colors"
                                                onClick={() => {
                                                    setAddMenu(false)
                                                    setFormData({ menus_url: "", menus_type: "" })
                                                    setUploadButton(false)
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
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
                        {showDeleted && selectedMenu && (
                            <div className="flex justify-center items-center mt-6">
                                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-beige px-4 py-3 rounded-xl">
                                    <h1 className="text-center text-sm sm:text-base font-semibold text-black">
                                        {selectedMenu.menus_text} menu has been deleted
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
                {showModal && selectedMenu && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
                        <div className="bg-beige p-6 sm:p-8 rounded-2xl shadow-xl max-w-sm sm:max-w-md w-full text-center">
                            <h2 className="text-lg sm:text-xl font-bold mb-4 text-black">Confirm Deletion</h2>
                            <p className="text-gray-700 mb-6 text-sm sm:text-base">
                                Are you sure you want to delete {selectedMenu.menus_text} menu?
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                                <button
                                    onClick={deleteMenus}
                                    className="bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-3 px-4 rounded-lg text-sm sm:text-base transition-colors"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => {
                                        setShowModal(false)
                                        setSelectedMenu(null)
                                    }}
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
