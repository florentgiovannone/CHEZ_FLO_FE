import React, { SyntheticEvent, useState } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { baseUrl } from "../config";
import { IContent } from "../interfaces/content";
import { IUser } from "../interfaces/users";

interface UpdateAboutProps {
    setContent: React.Dispatch<React.SetStateAction<IContent | null>>;
    content: IContent | null;
}

interface UserProps {
    user: null | IUser;
    setUser: Function;
}

export default function UpdateReservation({ content, setContent, user, setUser }: UpdateAboutProps & UserProps) {
    const { contentId } = useParams()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        reservation_title: "",
        reservation_text: "",
        breakfast_timing_day_one: "",
        breakfast_timing_hours_one: "",
        breakfast_timing_day_two: "",
        breakfast_timing_hours_two: "",
        lunch_timing_day_one: "",
        lunch_timing_hours_one: "",
        lunch_timing_day_two: "",
        lunch_timing_hours_two: "",
        dinner_timing_day_one: "",
        dinner_timing_hours_one: "",
        dinner_timing_day_two: "",
        dinner_timing_hours_two: "",
        reservation_line_one: "",
        reservation_line_two: "",
    })
    // Initialize form data with content values if they exist
    React.useEffect(() => {
        if (content) {
            setFormData({
                reservation_title: String(content.reservation_title) || "",
                reservation_text: String(content.reservation_text) || "",
                reservation_line_one: String(content.reservation_line_one) || "",
                reservation_line_two: String(content.reservation_line_two) || "",
                breakfast_timing_day_one: String(content.breakfast_timing_day_one) || "",
                breakfast_timing_hours_one: String(content.breakfast_timing_hours_one) || "",
                breakfast_timing_day_two: String(content.breakfast_timing_day_two) || "",
                breakfast_timing_hours_two: String(content.breakfast_timing_hours_two) || "",
                lunch_timing_day_one: String(content.lunch_timing_day_one) || "",
                lunch_timing_hours_one: String(content.lunch_timing_hours_one) || "",
                lunch_timing_day_two: String(content.lunch_timing_day_two) || "",
                lunch_timing_hours_two: String(content.lunch_timing_hours_two) || "",
                dinner_timing_day_one: String(content.dinner_timing_day_one) || "",
                dinner_timing_hours_one: String(content.dinner_timing_hours_one) || "",
                dinner_timing_day_two: String(content.dinner_timing_day_two) || "",
                dinner_timing_hours_two: String(content.dinner_timing_hours_two) || "",
            })
        }
    }, [content])

    function handleChange(e: any) {
        const fieldName = e.target.name
        const newFormData = structuredClone(formData)
        newFormData[fieldName as keyof typeof formData] = e.target.value
        setFormData(newFormData)
    }

    async function handleSubmit(e: SyntheticEvent) {
        e.preventDefault();
        try {
            const resp = await axios.put(`${baseUrl}/content/${contentId}/reservation`, formData);
            console.log("Update successful:", resp.data);

            navigate("/dashboard");
            window.location.reload();

        } catch (err) {
            console.error("Update failed:", err);
        }
    }


    return <>
        {(user ? <div className="min-h-screen bg-gray-50 px-4 py-8 md:py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-black mb-4 md:mb-6">Update Reservation section</h1>
                <p className="text-sm md:text-base text-gray-700 mb-6 md:mb-8">Please note that only the text content will be edited, and no changes will be made to the line structure, such as adding or removing line breaks</p>
                <form className="space-y-4 md:space-y-6">
                    <div className="field">
                        <h2 className="text-lg md:text-xl font-semibold text-black mb-2 md:mb-3">Title</h2>
                        <input
                            className="w-full p-3 md:p-4 border border-gray-300 rounded-md text-sm md:text-base"
                            placeholder="reservation_title"
                            type="text"
                            name="reservation_title"
                            onChange={handleChange}
                            value={formData.reservation_title}
                        />
                    </div>
                    <div className="field">
                        <h2 className="text-lg md:text-xl font-semibold text-black mb-2 md:mb-3">Text</h2>
                        <input
                            className="w-full p-3 md:p-4 border border-gray-300 rounded-md text-sm md:text-base"
                            placeholder="reservation_text"
                            name="reservation_text"
                            onChange={handleChange}
                            value={formData.reservation_text}
                        />
                    </div>
                    <div className="field">
                        <h2 className="text-lg md:text-xl font-semibold text-black mb-2 md:mb-3">Post booking text line one</h2>
                        <input
                            className="w-full p-3 md:p-4 border border-gray-300 rounded-md text-sm md:text-base"
                            placeholder="reservation_line_one"
                            type="text"
                            name="reservation_line_one"
                            onChange={handleChange}
                            value={formData.reservation_line_one}
                        />
                    </div>
                    <div className="field">
                        <h2 className="text-lg md:text-xl font-semibold text-black mb-2 md:mb-3">Post booking text line two</h2>
                        <input
                            className="w-full p-3 md:p-4 border border-gray-300 rounded-md text-sm md:text-base"
                            placeholder="reservation_line_two"
                            type="text"
                            name="reservation_line_two"
                            onChange={handleChange}
                            value={formData.reservation_line_two}
                        />
                    </div>
                    <div className="field">
                        <h2 className="text-lg md:text-xl font-semibold text-black mb-2 md:mb-3">Breakfast timing day one</h2>
                        <input
                            className="w-full p-3 md:p-4 border border-gray-300 rounded-md text-sm md:text-base"
                            placeholder="breakfast_timing_day_one"
                            type="text"
                            name="breakfast_timing_day_one"
                            onChange={handleChange}
                            value={formData.breakfast_timing_day_one}
                        />
                    </div>
                    <div className="field">
                        <h2 className="text-lg md:text-xl font-semibold text-black mb-2 md:mb-3">Breakfast timing hours one</h2>
                        <input
                            className="w-full p-3 md:p-4 border border-gray-300 rounded-md text-sm md:text-base"
                            placeholder="breakfast_timing_hours_one"
                            type="text"
                            name="breakfast_timing_hours_one"
                            onChange={handleChange}
                            value={formData.breakfast_timing_hours_one}
                        />
                    </div>
                    <div className="field">
                        <h2 className="text-lg md:text-xl font-semibold text-black mb-2 md:mb-3">Breakfast timing day two</h2>
                        <input
                            className="w-full p-3 md:p-4 border border-gray-300 rounded-md text-sm md:text-base"
                            placeholder="breakfast_timing_day_two"
                            type="text"
                            name="breakfast_timing_day_two"
                            onChange={handleChange}
                            value={formData.breakfast_timing_day_two}
                        />
                    </div>
                    <div className="field">
                        <h2 className="text-lg md:text-xl font-semibold text-black mb-2 md:mb-3">Breakfast timing hours two</h2>
                        <input
                            className="w-full p-3 md:p-4 border border-gray-300 rounded-md text-sm md:text-base"
                            placeholder="breakfast_timing_hours_two"
                            type="text"
                            name="breakfast_timing_hours_two"
                            onChange={handleChange}
                            value={formData.breakfast_timing_hours_two}
                        />
                    </div>
                    <div className="field">
                        <h2 className="text-lg md:text-xl font-semibold text-black mb-2 md:mb-3">Lunch timing day one</h2>
                        <input
                            className="w-full p-3 md:p-4 border border-gray-300 rounded-md text-sm md:text-base"
                            placeholder="lunch_timing_day_one"
                            type="text"
                            name="lunch_timing_day_one"
                            onChange={handleChange}
                            value={formData.lunch_timing_day_one}
                        />
                    </div>
                    <div className="field">
                        <h2 className="text-lg md:text-xl font-semibold text-black mb-2 md:mb-3">Lunch timing hours one</h2>
                        <input
                            className="w-full p-3 md:p-4 border border-gray-300 rounded-md text-sm md:text-base"
                            placeholder="lunch_timing_hours_one"
                            type="text"
                            name="lunch_timing_hours_one"
                            onChange={handleChange}
                            value={formData.lunch_timing_hours_one}
                        />
                    </div>
                    <div className="field">
                        <h2 className="text-lg md:text-xl font-semibold text-black mb-2 md:mb-3">Lunch timing day two</h2>
                        <input
                            className="w-full p-3 md:p-4 border border-gray-300 rounded-md text-sm md:text-base"
                            placeholder="lunch_timing_day_two"
                            type="text"
                            name="lunch_timing_day_two"
                            onChange={handleChange}
                            value={formData.lunch_timing_day_two}
                        />
                    </div>
                    <div className="field">
                        <h2 className="text-lg md:text-xl font-semibold text-black mb-2 md:mb-3">Lunch timing hours two</h2>
                        <input
                            className="w-full p-3 md:p-4 border border-gray-300 rounded-md text-sm md:text-base"
                            placeholder="lunch_timing_hours_two"
                            type="text"
                            name="lunch_timing_hours_two"
                            onChange={handleChange}
                            value={formData.dinner_timing_hours_one}
                        />
                    </div>
                    <div className="field">
                        <h2 className="text-lg md:text-xl font-semibold text-black mb-2 md:mb-3">Dinner timing day two</h2>
                        <input
                            className="w-full p-3 md:p-4 border border-gray-300 rounded-md text-sm md:text-base"
                            placeholder="dinner_timing_day_two"
                            type="text"
                            name="dinner_timing_day_two"
                            onChange={handleChange}
                            value={formData.dinner_timing_day_two}
                        />
                    </div>
                    <div className="field">
                        <h2 className="text-lg md:text-xl font-semibold text-black mb-2 md:mb-3">Dinner timing hours two</h2>
                        <input
                            className="w-full p-3 md:p-4 border border-gray-300 rounded-md text-sm md:text-base"
                            placeholder="dinner_timing_hours_two"
                            type="text"
                            name="dinner_timing_hours_two"
                            onChange={handleChange}
                            value={formData.dinner_timing_hours_two}
                        />
                    </div>
                    <div className="field">
                        <h2 className="text-lg md:text-xl font-semibold text-black mb-2 md:mb-3">Post booking button text line one</h2>
                        <input
                            className="w-full p-3 md:p-4 border border-gray-300 rounded-md text-sm md:text-base"
                            placeholder="reservation_line_one"
                            type="text"
                            name="reservation_line_one"
                            onChange={handleChange}
                            value={formData.reservation_line_one}
                        />
                    </div>
                    <div className="field">
                        <h2 className="text-lg md:text-xl font-semibold text-black mb-2 md:mb-3">Post booking button text line two</h2>
                        <input
                            className="w-full p-3 md:p-4 border border-gray-300 rounded-md text-sm md:text-base"
                            placeholder="reservation_line_two"
                            type="text"
                            name="reservation_line_two"
                            onChange={handleChange}
                            value={formData.reservation_line_two}
                        />
                    </div>
                    <p className="text-sm md:text-base text-gray-700">Please note that to update contact details, please go to the <strong><a href="/updateContact/${contentId}/contact" className="text-blue-600 hover:text-blue-800">contact us section</a></strong></p>
                    <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-4 mt-8 md:mt-10">
                        <button
                            onClick={() => navigate(`/dashboard`)}
                            className="w-full md:w-auto rounded-xl h-12 md:h-14 bg-black text-beige hover:bg-opacity-50 text-sm md:text-base font-semibold"
                        >
                            Cancel and return to dashboard
                        </button>

                        <button
                            onClick={() => navigate(`/EditMainPage`)}
                            className="w-full md:w-auto rounded-xl h-12 md:h-14 bg-black text-beige hover:bg-opacity-50 text-sm md:text-base font-semibold"
                        >
                            Cancel and return to edit page
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="w-full md:w-auto rounded-xl h-12 md:h-14 bg-black text-beige hover:bg-opacity-50 text-sm md:text-base font-semibold"
                        >
                            Update and return to dashboard
                        </button>
                    </div>
                </form>
            </div>
        </div>
            :
            <div className="min-h-screen bg-gray-50 px-4 py-8 md:py-12 flex flex-col items-center justify-center">
                <div className="text-center max-w-md mx-auto">
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-black mb-6 md:mb-8">You are not logged in, please login before entering the user content</h1>
                    <a href="/login">
                        <button
                            onClick={() => {
                                window.location.href = "/login";
                            }}
                            className="w-full md:w-auto rounded-xl h-12 md:h-14 bg-black text-beige text-sm md:text-base font-semibold">
                            Login
                        </button>
                    </a>
                </div>
            </div>
        )}
    </>
}