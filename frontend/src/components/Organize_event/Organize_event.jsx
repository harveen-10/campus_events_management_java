import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Organize_event() {
    const location = useLocation();
    const { srn } = location.state || {};
    console.log(srn);
    const navigate = useNavigate();

    const [organizerDetails, setOrganizerDetails] = useState({
        srn: '',
        ename: '',
        ecode: '',
        name: '',
        email: '',
        phone_no: '',
    });
    const [events, setEvents] = useState([]); // Ensure events is an array initially
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch("http://localhost:3000/home", {
                    method: "GET",
                    headers: {
                        'Content-Type': "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }

                const data = await response.json();
                console.log(data)
                
                // Check if data is an array, otherwise set an empty array
                setEvents(Array.isArray(data.products) ? data.products : []);
            } catch (error) {
                console.error('Error fetching events: ', error);
                setEvents([]); // Set events to an empty array in case of an error
            }
        };

        fetchEvents();
    }, []); // Only run on component mount

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrganizerDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(organizerDetails);
    
        try {
            const response = await fetch("http://localhost:3000/addorganizer", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(organizerDetails),
            });
            console.log(organizerDetails);
    
            const data = await response.text();
            setMessage(data); 
    
            if (response.ok) {
                setTimeout(() => {
                    const currentUser={ srn: srn.srn };
                    navigate("/home", { state: { currentUser } });
                }, 3000);
            }
        } catch (error) {
            console.error("Error adding organizer:", error);
            setMessage("Error adding organizer.");
        }
    };
    

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <button
                onClick={() => {
                    const currentUser = { srn: srn.srn };
                    navigate("/home", { state: { currentUser } });
                }}
                className="self-start mb-4 text-indigo-500 underline"
            >
                Back to Home
            </button>

            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Organize Event</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="srn" className="block text-gray-600">SRN:</label>
                        <input
                            type="text"
                            id="srn"
                            name="srn"
                            value={organizerDetails.srn}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="ename" className="block text-gray-600">Event Name:</label>
                        <select
                            id="ename"
                            name="ename"
                            value={organizerDetails.ename}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                        >
                            <option value="">Select an event</option>
                            {events.length > 0 && events.map((event) => (
                                <option key={event.EventID} value={event.Ename}>
                                    {event.Ename}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="ecode" className="block text-gray-600">Event Code (ecode):</label>
                        <input
                            type="text"
                            id="ecode"
                            name="ecode"
                            value={organizerDetails.ecode}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-gray-600">Organizer Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={organizerDetails.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-gray-600">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={organizerDetails.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="phone_no" className="block text-gray-600">Phone Number:</label>
                        <input
                            type="tel"
                            id="phone_no"
                            name="phone_no"
                            value={organizerDetails.phone_no}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition duration-200"
                        >
                            Add Organizer
                        </button>
                    </div>

                    {message && <p className="text-center text-red-500 mt-4">{message}</p>}
                </form>
            </div>
        </div>
    );
}

export default Organize_event;
