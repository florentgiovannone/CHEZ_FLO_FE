import React, { SyntheticEvent, useState } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { baseUrl } from "../config";
import { IContent } from "../interfaces/content";
import { IUser } from "../interfaces/users";
import NotLogged from "./NotLogged";

interface UpdateAboutProps {
    setContent: React.Dispatch<React.SetStateAction<IContent | null>>;
    content: IContent | null;
}

interface UserProps {
    user: null | IUser;
    setUser: Function;
}

export default function UpdateAbout({ content, setContent, user }: UpdateAboutProps & UserProps) {
    const { contentId } = useParams()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        about_title: "",
        about_text: "",
    })

    // Initialize form data with content values if they exist
    React.useEffect(() => {
        if (content) {
            setFormData({
                about_title: String(content.about_title) || "",
                about_text: String(content.about_text) || ""
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
            const resp = await axios.put(`${baseUrl}/content/${contentId}/about`, formData);
            console.log("Update successful:", resp.data);

            navigate("/dashboard");
            window.location.reload();

        } catch (err) {
            console.error("Update failed:", err);
        }
    }


    return <>{(user ?
        <div className="bg-gray-50 px-4 py-8 md:py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-black mb-4 md:mb-6">Update About section</h1>
                <p className="text-sm md:text-base text-gray-700 mb-6 md:mb-8">Please note that only the text content will be edited, and no changes will be made to the line structure, such as adding or removing line breaks</p>
                <form className="space-y-4 md:space-y-6">
                    <div className="field">
                        <input
                            className="w-full p-3 md:p-4 border border-gray-300 rounded-md text-sm md:text-base hover:bg-black hover:text-beige hover:cursor-pointer"
                            placeholder="about_title"
                            type="text"
                            name="about_title"
                            onChange={handleChange}
                            value={formData.about_title}
                        />
                    </div>
                    <div className="field">
                        <textarea
                            className="w-full min-h-40 md:min-h-52 p-3 md:p-4 border border-gray-300 rounded-md text-sm md:text-base"
                            placeholder="about_text"
                            name="about_text"
                            onChange={handleChange}
                            value={formData.about_text}
                        />
                    </div>
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
        </div> :
        <NotLogged />
    )} </>
}