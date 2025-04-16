import React, { useState } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { baseUrl } from "../config"
import { IUser } from "../interfaces/users"

interface ContentProps {
    allUsers: IUser[]
    setallUsers: React.Dispatch<React.SetStateAction<IUser[]>>
}

export default function UserList({ allUsers, setallUsers }: ContentProps) {
    const [showDeleted, setShowDeleted] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [deletedUserName, setDeletedUserName] = useState<string | null>(null)
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null)

    const { userId } = useParams()
    const navigate = useNavigate()

    async function deleteUser() {
        if (!selectedUser) return
        const token = localStorage.getItem("token")

        try {
            await axios.delete(`${baseUrl}/users/${selectedUser.id}`, {
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
                className="bg-black text-beige grid grid-flow-col grid-cols-3 lg:grid-cols-4 gap-4 border-2 m-3 p-4 items-center rounded-3xl md:w-full"
            >
                <div>{user.firstname}</div>
                <div>{user.lastname}</div>
                <div className="hidden lg:inline">{user.email}</div>
                <div className="inline-flex justify-end">
                    <a href={`/updateaccount/${user.id}`}>
                        <button className="bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold py-2 px-4 mr-2 rounded-xl">
                            Update
                        </button>
                    </a>
                    <button
                        onClick={() => {
                            setSelectedUser(user)
                            setShowModal(true)
                        }}
                        className="bg-black hover:bg-beige text-beige hover:text-black border hover:border-black border-beige font-bold py-2 px-4 rounded-xl"
                    >
                        Delete
                    </button>
                </div>
            </div>
        ))

    return (
        <div className=" flex flex-col bg-white mt-40 mb-96">
            <main className="flex-grow flex flex-col items-center justify-start py-10 ">
                <div className="container w-full">
                    {showModal && selectedUser && (
                        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                            <div className="bg-beige p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                                <h2 className="text-xl font-bold mb-4 text-black">Confirm Deletion</h2>
                                <p className="text-gray-700 mb-6">
                                    Are you sure you want to delete{" "}
                                    <strong>
                                        {selectedUser.firstname} {selectedUser.lastname}
                                    </strong>
                                    ?
                                </p>
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={deleteUser}
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

                    <div className="grid grid-flow-col grid-cols-3 lg:grid-cols-4 gap-4 m-3 p-4 items-center rounded-3xl md:w-full font-bold text-black">
                        <div>Firstname</div>
                        <div>Lastname</div>
                        <div className="hidden lg:inline">Email</div>
                    </div>

                    {userMap()}

                    <div className="flex justify-center mt-10">
                        <a href="/dashboard">
                            <button className="bg-black hover:bg-beige text-beige hover:text-black border border-b-beige hover:border-black font-bold p-4 mr-2 rounded-xl">
                                Return to dashboard
                            </button>
                        </a>
                    </div>

                    {showDeleted && deletedUserName && (
                        <div className="flex justify-center items-center m-3 p-4 rounded-3xl w-full">
                            <h1 className="text-center text-lg font-semibold text-black bg-beige px-6 py-3 rounded-xl">
                                {deletedUserName} has been deleted
                            </h1>
                        </div>
                    )}
                </div>
            </main>

        </div>
    )
}