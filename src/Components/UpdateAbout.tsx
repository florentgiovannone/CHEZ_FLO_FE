import React, { SyntheticEvent, useState } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { baseUrl } from "../config";


export default function UpdateAbout() {
    // console.log(content?.carousels);

    const { contentId } = useParams()
    const navigate = useNavigate()

    React.useEffect(() => {
        async function fetchContent() {
            try {
                const resp = await axios.get(`${baseUrl}/content/${contentId}/about`);

                setFormData(resp.data);
                console.log(resp.data);
                
            } catch (err) {
                console.error("Error fetching content:", err);
            }
        }
        fetchContent();
    }, []);

    const [formData, setFormData] = useState({
        about_title: "",
        about_text: "",
    })

    function handleChange(e: any) {
        const fieldName = e.target.name
        const newFormData = structuredClone(formData)
        newFormData[fieldName as keyof typeof formData] = e.target.value
        setFormData(newFormData)
    }

    async function handleSubmit(e: SyntheticEvent) {
        e.preventDefault();
        try {
            const resp = await axios.put(`${baseUrl}/content/${contentId}/about`, formData);
            console.log("Update successful:", resp.data);

            navigate("/dashboard");
            window.location.reload();

        } catch (err) {
            console.error("Update failed:", err);
        }
    }


    return <>
        <div className="section flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="container w-full ">
                <h1 className="text-2xl">Update About section</h1>
                <p>Please note that only the text content will be edited, and no changes will be made to the line structure, such as adding or removing line breaks</p>
                <form>
                    <div className="field mt-4">
                        <input
                            className="w-full p-4 border border-gray-300 rounded-md"
                            placeholder="about_title"
                            type="text"
                            name="about_title"
                            onChange={handleChange}
                            value={formData.about_title}
                        />
                    </div>
                    <div className="field mt-4">
                        <textarea
                            className="w-full min-h-52 p-4 border border-gray-300 rounded-md"
                            placeholder="about_text"
                            name="about_text"
                            onChange={handleChange}
                            value={formData.about_text}
                        />
                    </div>
                    <div className="flex justify-center mt-10 gap-4">
                        <button
                            onClick={() => navigate(`/dashboard`)}
                            className="mb-5 rounded-xl w-full sm:w-96 h-12 bg-black text-beige hover:bg-opacity-50"
                        >
                            Return to dashboard
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="mb-5 rounded-xl w-full sm:w-96 h-12 bg-black text-beige hover:bg-opacity-50"
                        >
                            Update
                        </button>
                        <button
                            onClick={() => navigate(`/EditMainPage`)}
                            className="mb-5 rounded-xl w-full sm:w-96 h-12 bg-black text-beige hover:bg-opacity-50"
                        >
                            Return to edit page
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </>
}