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
        {(user ? <div className="my-10 section flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="container w-full ">
                <h1 className="text-2xl">Update Reservation section</h1>
                <p>Please note that only the text content will be edited, and no changes will be made to the line structure, such as adding or removing line breaks</p>
                <form>
                    <div className="field mt-4">
                        <h1 className="text-xl">Title</h1>
                        <input
                            className="w-full p-4 border border-gray-300 rounded-md"
                            placeholder="reservation_title"
                            type="text"
                            name="reservation_title"
                            onChange={handleChange}
                            value={formData.reservation_title}
                        />
                    </div>
                    <div className="field mt-4">
                        <h1 className="text-xl">Text</h1>
                        <input
                            className="w-full  p-4 border border-gray-300 rounded-md"
                            placeholder="reservation_text"
                            name="reservation_text"
                            onChange={handleChange}
                            value={formData.reservation_text}
                        />
                    </div>
                    <div className="field mt-4">
                        <h1 className="text-xl">Post booking text line one</h1>
                        <input
                            className="w-full p-4 border border-gray-300 rounded-md"
                            placeholder="reservation_line_one"
                            type="text"
                            name="reservation_line_one"
                            onChange={handleChange}
                            value={formData.reservation_line_one}
                        />
                    </div>
                    <div className="field mt-4">
                        <h1 className="text-xl">Post booking text line two</h1>
                        <input
                            className="w-full p-4 border border-gray-300 rounded-md"
                            placeholder="reservation_line_two"
                            type="text"
                            name="reservation_line_two"
                            onChange={handleChange}
                            value={formData.reservation_line_two}
                        />
                    </div>
                    <div className="field mt-4">
                        <h1 className="text-xl">Breakfast timing day one</h1>
                        <input
                            className="w-full p-4 border border-gray-300 rounded-md"
                            placeholder="breakfast_timing_day_one"
                            type="text"
                            name="breakfast_timing_day_one"
                            onChange={handleChange}
                            value={formData.breakfast_timing_day_one}
                        />
                    </div>  
                    <div className="field mt-4">
                        <h1 className="text-xl">Breakfast timing hours one</h1>
                        <input
                            className="w-full p-4 border border-gray-300 rounded-md"
                            placeholder="breakfast_timing_hours_one"    
                            type="text"
                            name="breakfast_timing_hours_one"
                            onChange={handleChange}
                            value={formData.breakfast_timing_hours_one}
                        />
                    </div>
                    <div className="field mt-4">
                        <h1 className="text-xl">Breakfast timing day two</h1>
                        <input
                            className="w-full p-4 border border-gray-300 rounded-md"
                            placeholder="breakfast_timing_day_two"
                            type="text"
                            name="breakfast_timing_day_two"
                            onChange={handleChange}
                            value={formData.breakfast_timing_day_two}
                        />
                    </div>      
                    <div className="field mt-4">
                        <h1 className="text-xl">Breakfast timing hours two</h1>
                        <input
                            className="w-full p-4 border border-gray-300 rounded-md"
                            placeholder="breakfast_timing_hours_two"
                            type="text"
                            name="breakfast_timing_hours_two"
                            onChange={handleChange}
                            value={formData.breakfast_timing_hours_two}
                        />
                    </div>
                    <div className="field mt-4">
                        <h1 className="text-xl">Lunch timing day one</h1>
                        <input
                            className="w-full p-4 border border-gray-300 rounded-md"
                            placeholder="lunch_timing_day_one"
                            type="text"
                            name="lunch_timing_day_one"
                            onChange={handleChange}
                            value={formData.lunch_timing_day_one}
                        />
                    </div>
                    <div className="field mt-4">
                        <h1 className="text-xl">Lunch timing hours one</h1>
                        <input
                            className="w-full p-4 border border-gray-300 rounded-md"
                            placeholder="lunch_timing_hours_one"
                            type="text"
                            name="lunch_timing_hours_one"
                            onChange={handleChange}
                            value={formData.lunch_timing_hours_one}
                        />
                    </div>
                    <div className="field mt-4">
                        <h1 className="text-xl">Lunch timing day two</h1>
                        <input
                            className="w-full p-4 border border-gray-300 rounded-md"
                            placeholder="lunch_timing_day_two"
                            type="text"
                            name="lunch_timing_day_two"
                            onChange={handleChange}
                            value={formData.lunch_timing_day_two}
                        />
                    </div>
                    <div className="field mt-4">
                        <h1 className="text-xl">Lunch timing hours two</h1>
                        <input
                            className="w-full p-4 border border-gray-300 rounded-md"
                            placeholder="lunch_timing_hours_two"
                            type="text"
                            name="lunch_timing_hours_two"
                            onChange={handleChange}
                            value={formData.dinner_timing_hours_one}
                        />
                    </div>
                    <div className="field mt-4">
                        <h1 className="text-xl">Dinner timing day two</h1>
                        <input
                            className="w-full p-4 border border-gray-300 rounded-md"
                            placeholder="dinner_timing_day_two"
                            type="text"
                            name="dinner_timing_day_two"
                            onChange={handleChange}
                            value={formData.dinner_timing_day_two}
                        />
                    </div>  
                    <div className="field mt-4">
                        <h1 className="text-xl">Dinner timing hours two</h1>
                        <input
                            className="w-full p-4 border border-gray-300 rounded-md"
                            placeholder="dinner_timing_hours_two"
                            type="text"
                            name="dinner_timing_hours_two"
                            onChange={handleChange}
                            value={formData.dinner_timing_hours_two}
                        />
                    </div>
                    <div className="field mt-4">
                        <h1 className="text-xl">Post booking button text line one</h1>
                        <input
                            className="w-full p-4 border border-gray-300 rounded-md"
                            placeholder="reservation_line_one"
                            type="text"
                            name="reservation_line_one"
                            onChange={handleChange}
                            value={formData.reservation_line_one}
                        />
                    </div>
                    <div className="field mt-4">
                        <h1 className="text-xl">Post booking button text line two</h1>
                        <input
                            className="w-full p-4 mb-5 border border-gray-300 rounded-md"
                            placeholder="reservation_line_two"
                            type="text"
                            name="reservation_line_two"
                            onChange={handleChange}
                            value={formData.reservation_line_two}
                        />
                    </div>
                    <p className="text-md">Please note that to update contact details, please go to the <strong><a href="/updateContact/${contentId}/contact">contact us section</a></strong></p>
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
        <div className="m-28">
            <div className="mb-10">
                <h1 className="text-3xl">You are not loged in, please login before entering the user content</h1>
            </div>
            <div>
                <a href="/login">
                    <button
                        onClick={() => {
                            window.location.href = "/login";
                        }}
                        className="rounded-full w-96 h-12 bg-black text-beige">Login
                    </button>
                </a>
            </div>
        </div>
    )}
    </>
}