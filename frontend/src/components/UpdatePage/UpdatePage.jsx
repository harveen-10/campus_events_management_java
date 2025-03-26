import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function UpdatePage() {
    const location = useLocation();
    const { currentUser } = location.state || {};
    console.log(currentUser);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ EventID: currentUser.eventID, ID: currentUser.ID });
    console.log("form data in the beginning", formData);
    const [error, setError] = useState(null);

    useEffect(() => {
        
        let url = '';

        switch (currentUser.tab) {
            case 'sponsors':
                url = `http://localhost:8080/events/sponsorByID?sponsorID=${currentUser.ID}`;
                break;
            case 'guests':
                url = `http://localhost:8080/events/GuestByID?guestID=${currentUser.ID}`;
                break;
            case 'finances':
                url = `http://localhost:8080/events/FinanceByID?transID=${currentUser.ID}`;
                break;
            default:
                alert("Invalid tab selected.");
                return;
        }

        const fetchData = async () => {
            console.log("url: ", url);
            try {
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        'Content-Type': "application/json",
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch event data');
                }

                const data = await response.json();
                console.log("data after getting in update page: ", data);
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    ...data,
                }));
                console.log("form data after setting it: ", formData);
            } catch (err) {
                console.error("Error fetching event data:", err);
                setError("Failed to load event data.");
            }
        };

        fetchData();
    }, [currentUser.eventID, currentUser.tab]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // console.log("formdata in between: ",formData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let url = '';

        switch (currentUser.tab) {
            case 'sponsors':
                url = 'http://localhost:8080/events/updatesponsor';
                break;
            case 'guests':
                url = 'http://localhost:8080/events/updateguest';
                break;
            case 'finances':
                url = 'http://localhost:8080/events/updatefinance';
                break;
            default:
                alert("Invalid tab selected.");
                return;
        }

        try {
            console.log("formData when sending for update: ", formData);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);

                const srn = { srn: currentUser.srn };
                navigate("/event_info", { state: { srn } });
            }
        } catch (error) {
            console.error("Error inserting data:", error);
            setError("An error occurred while inserting data.");
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 py-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Update {currentUser.tab.charAt(0).toUpperCase() + currentUser.tab.slice(1)} Details
            </h2>
            <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {currentUser.tab === 'sponsors' && (
                        <>
                            <label className="font-semibold">Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name || ''}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <label className="font-semibold">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email || ''}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <label className="font-semibold">Contribution</label>
                            <input
                                type="text"
                                name="contribution"
                                placeholder="Contribution"
                                value={formData.contribution || ''}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <label className="font-semibold">Phone Number</label>
                            <input
                                type="text"
                                name="phoneNo"
                                placeholder="Phone Number"
                                value={formData.phoneNo || ''}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </>
                    )}
                    {currentUser.tab === 'guests' && (
                        <>
                            <label className="font-semibold">Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name || ''}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <label className="font-semibold">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email || ''}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <label className="font-semibold">Role</label>
                            <input
                                type="text"
                                name="role"
                                placeholder="Role"
                                value={formData.role || ''}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <label className="font-semibold">Phone Number</label>
                            <input
                                type="text"
                                name="phone_no"
                                placeholder="Phone Number"
                                value={formData.phone_no || ''}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </>
                    )}
                    {currentUser.tab === 'finances' && (
                        <>
                            <label className="font-semibold">Spent On</label>
                            <input
                                type="text"
                                name="spentOn"
                                placeholder="Spent on"
                                value={formData.spentOn || ''}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <label className="font-semibold">Amount</label>
                            <input
                                type="number"
                                name="amount"
                                placeholder="Amount"
                                value={formData.amount || ''}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <label className="font-semibold">Receipt</label>
                            <input
                                type="text"
                                name="receipt"
                                placeholder="Receipt"
                                value={formData.receipt || ''}
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
            </div>
        </div>
    );
}

export default UpdatePage;
