import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function InsertPage() {
    const location = useLocation();
    const { currentUser } = location.state || {};
    console.log(currentUser);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        console.log(formData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let url = '';
        let updatedFormData = { ...formData };

        switch (currentUser.tab) {
            case 'sponsors':
                url = 'http://localhost:8080/events/insertsponsor';
                updatedFormData = { ...formData, id: { eventID: currentUser.eventID } };
                break;
            case 'guests':
                url = 'http://localhost:8080/events/insertguest';
                updatedFormData = { ...formData, guestId: { eventID: currentUser.eventID } };
                break;
            case 'finances':
                url = 'http://localhost:8080/events/insertfinance';
                updatedFormData = { ...formData, financeId: { eventID: currentUser.eventID } };
                break;
            default:
                alert("Invalid tab selected.");
                return;
        }
        console.log("formData: ", updatedFormData);

        try {
            console.log("formData: ", updatedFormData);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFormData),
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);

                const srn = { srn: currentUser.srn };
                navigate("/event_info", { state: { srn } });
            }
            // navigate('/event_info');

        } catch (error) {
            console.error("Error inserting data:", error);
            setError("An error occurred while inserting data.");
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 py-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Insert {currentUser.tab.charAt(0).toUpperCase() + currentUser.tab.slice(1)} Details
            </h2>
            <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {currentUser.tab === 'sponsors' && (
                        <>
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                name="contribution"
                                placeholder="Contribution"
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                name="phoneNo"
                                placeholder="Phone Number"
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </>
                    )}
                    {currentUser.tab === 'guests' && (
                        <>
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                name="role"
                                placeholder="Role"
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                name="phone_no"
                                placeholder="Phone Number"
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </>
                    )}
                    {currentUser.tab === 'finances' && (
                        <>
                            <input
                                type="text"
                                name="spentOn"
                                placeholder="Spent on"
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="number"
                                name="amount"
                                placeholder="Amount"
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                name="receipt"
                                placeholder="Receipt"
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </>
                    )}

                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Save
                    </button>
                </form>
                {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
            </div>
        </div>
    );
}

export default InsertPage;
