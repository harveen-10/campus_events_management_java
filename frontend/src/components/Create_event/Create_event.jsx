import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Create_event() {
    const location = useLocation();
    const { srn } = location.state || {};
    console.log(srn);
    const navigate = useNavigate();

    // State for form data
    const [eventData, setEventData] = useState({
        ename: '',
        category: '',
        eventDate: '',
        domain: '', 
        poster: '',
        startTime: '',
        endTime: '',
        teamSize: ''
    });

    const [message, setMessage] = useState('');
    const [ecode, setEcode] = useState(null);

    // Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData({
            ...eventData,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log("eventdata: ", eventData);
            // Send the event details to the backend to create the event
            const response = await fetch('http://localhost:8080/events/newevent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData),
            });

            if (!response.ok) {
                throw new Error('Failed to create event');
            }

            const data = await response.json();
            console.log(data);

            // Display the popup message with the ecode
            setMessage(`The event has been created. And this is the Event code ${data.ecode}. Please enter it for organizing the event.`);
            setEcode(data.ecode);

            // Optionally, navigate back after a short delay
            setTimeout(() => {
                const currentUser={ srn: srn.srn };
                navigate("/home", { state: { currentUser } });
            }, 5000); // Delay to allow user to read the message

        } catch (err) {
            console.error('Error during event creation:', err);
            setMessage('Couldnt create event. A similar event already exists at that time.');
        }
    };

    return (
        <>
        <button
            onClick={() => {
                const currentUser = { srn: srn.srn };
                navigate("/home", { state: { currentUser } });
            }}
            className="self-start mb-4 text-blue-600 underline hover:text-blue-800"
        >
            Back to Home
        </button>

        <div className="flex flex-col items-center min-h-screen p-4 bg-gray-100">
            <h1 className="text-3xl font-semibold mb-6 text-indigo-600">Create New Event</h1>
            
            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-4">
                    <label className="block text-lg font-medium text-gray-700" htmlFor="ename">Event Name</label>
                    <input
                        type="text"
                        id="ename"
                        name="ename"
                        value={eventData.ename}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-medium text-gray-700">Category</label>
                    <div className="flex gap-4">
                        <label>
                            <input
                                type="radio"
                                name="category"
                                value="Hackathon"
                                checked={eventData.category === "Hackathon"}
                                onChange={handleChange}
                            />
                            Hackathon
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="category"
                                value="Workshop"
                                checked={eventData.category === "Workshop"}
                                onChange={handleChange}
                            />
                            Workshop
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="category"
                                value="Competition"
                                checked={eventData.category === "Competition"}
                                onChange={handleChange}
                            />
                            Competition
                        </label>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-medium text-gray-700">Domain</label>
                    <div className="flex gap-4">
                        <label>
                            <input
                                type="radio"
                                name="domain"
                                value="Technical"
                                checked={eventData.domain === "Technical"}
                                onChange={handleChange}
                            />
                            Technical
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="domain"
                                value="Non-Technical"
                                checked={eventData.domain === "Non-Technical"}
                                onChange={handleChange}
                            />
                            Non-Technical
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="domain"
                                value="Cultural"
                                checked={eventData.domain === "Cultural"}
                                onChange={handleChange}
                            />
                            Cultural
                        </label>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-medium text-gray-700" htmlFor="eventData">Event Date</label>
                    <input
                        type="date"
                        id="eventDate"
                        name="eventDate"
                        value={eventData.eventDate}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-medium text-gray-700" htmlFor="poster">Poster URL</label>
                    <input
                        type="text"
                        id="poster"
                        name="poster"
                        value={eventData.poster}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-medium text-gray-700" htmlFor="startTime">Start Time</label>
                    <input
                        type="time"
                        id="startTime"
                        name="startTime"
                        value={eventData.startTime}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-medium text-gray-700" htmlFor="endTime">End Time</label>
                    <input
                        type="time"
                        id="endTime"
                        name="endTime"
                        value={eventData.endTime}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-medium text-gray-700" htmlFor="teamSize">Team Size</label>
                    <input
                        type="number"
                        id="teamSize"
                        name="teamSize"
                        value={eventData.teamSize}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <button 
                    type="submit" 
                    className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Save
                </button>
            </form>

            {message && (
                <div className="mt-6 text-center text-xl font-semibold text-green-600">
                    {message}
                </div>
            )}
        </div>
        </>
    );
}

export default Create_event;
