import React, { useState } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { baseUrl } from "../config"
import { IUser } from "../interfaces/users"

interface UserProps {
    allUsers: IUser[]
    setallUsers: React.Dispatch<React.SetStateAction<IUser[]>>
}

export default function UserList({ allUsers, setallUsers }: UserProps) {
    const [showDeleted, setShowDeleted] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [deletedUserName, setDeletedUserName] = useState<string | null>(null)
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null)

    const { userId } = useParams()
    const navigate = useNavigate()

    function dismissMessage() {
        setShowDeleted(false)
        setSelectedUser(null)
    }

    async function deleteUser() {
        if (!selectedUser) return
        const token = localStorage.getItem("token")

        try {
            await axios.delete(`${baseUrl}/user/${selectedUser.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            setDeletedUserName(`${selectedUser.firstname} ${selectedUser.lastname}`)
            setallUsers(prev => prev.filter(user => user.id !== selectedUser.id))
            setShowDeleted(true)
            setShowModal(false)
        } catch (error) {
            console.error("Delete failed:", error)
            alert("Something went wrong.")
        }
    }

    const userMap = () =>
        allUsers?.map(user => (
            <div
                key={user.id}
                className="bg-black text-beige p-4 sm:p-6 rounded-xl shadow-lg"
            >
                <div className="space-y-3">
                    {/* User Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        <div className="space-y-1">
                            <label className="text-xs sm:text-sm font-medium text-beige opacity-75">
                                First Name
                            </label>
                            <div className="text-sm sm:text-base font-semibold">
                                {user.firstname}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs sm:text-sm font-medium text-beige opacity-75">
                                Last Name
                            </label>
                            <div className="text-sm sm:text-base font-semibold">
                                {user.lastname}
                            </div>
                        </div>
                        <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                            <label className="text-xs sm:text-sm font-medium text-beige opacity-75">
                                Email
                            </label>
                            <div className="text-sm sm:text-base font-semibold break-all">
                                {user.email}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <a href={`/updateaccount/${user.id}`} className="flex-1">
                            <button className="w-full bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-2 px-4 rounded-lg text-sm sm:text-base transition-colors">
                                Update
                            </button>
                        </a>
                        <button
                            onClick={() => {
                                setSelectedUser(user)
                                setShowModal(true)
                            }}
                            className="flex-1 bg-black hover:bg-beige text-beige hover:text-black border border-beige hover:border-black font-bold py-2 px-4 rounded-lg text-sm sm:text-base transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        ))

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-black">
                        User Management
                    </h1>

                    {/* Modal */}
                    {showModal && selectedUser && (
                        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
                            <div className="bg-beige p-6 sm:p-8 rounded-2xl shadow-xl max-w-sm sm:max-w-md w-full text-center">
                                <h2 className="text-lg sm:text-xl font-bold mb-4 text-black">Confirm Deletion</h2>
                                <p className="text-gray-700 mb-6 text-sm sm:text-base">
                                    Are you sure you want to delete{" "}
                                    <strong>
                                        {selectedUser.firstname} {selectedUser.lastname}
                                    </strong>
                                    ?
                                </p>
                                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                                    <button
                                        onClick={deleteUser}
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

                    {/* User List */}
                    <div className="space-y-4">
                        {userMap()}
                    </div>

                    {/* Navigation Button */}
                    <div className="flex justify-center mt-8 sm:mt-10">
                        <a href="/dashboard" className="flex-1 sm:flex-none">
                            <button className="w-full sm:w-auto bg-black hover:bg-gray-800 text-beige hover:text-beige border border-black hover:border-gray-800 font-bold py-3 px-6 rounded-lg text-sm sm:text-base transition-colors">
                                Return to Dashboard
                            </button>
                        </a>
                    </div>

                    {/* Success Message */}
                    {showDeleted && deletedUserName && (
                        <div className="flex justify-center items-center mt-6">
                            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-beige px-4 py-3 rounded-xl">
                                <h1 className="text-center text-sm sm:text-base font-semibold text-black">
                                    {deletedUserName} has been deleted
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
        </div>
    )
}