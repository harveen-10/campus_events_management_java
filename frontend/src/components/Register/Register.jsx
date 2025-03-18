import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Register() {
    const location = useLocation();
    const { newUser } = location.state || {};
    console.log(newUser);
    const eventID = newUser.eventID;
    const navigate = useNavigate();

    const [teamSize, setTeamSize] = useState(1);
    const [teamName, setTeamName] = useState('');
    const [participants, setParticipants] = useState([]);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');  // Add success message state

    // Fetch teamSize based on eventID
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/eventdetails?eventId=${eventID}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': "application/json",
                    }
                });

                const data = await response.json();
                console.log(data);
                setTeamSize(data.TeamSize);
                console.log("Teamsize", data.TeamSize);

                const initialParticipants = Array(data.TeamSize).fill({
                    srn: '',
                    name: '',
                    email: '',
                    phone: ''
                });
                setParticipants(initialParticipants);

            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchData();
    }, [eventID]);

    const handleInputChange = (index, field, value) => {
        setParticipants(prevParticipants => {
            const updatedParticipants = [...prevParticipants]; // Create a shallow copy of the participants array
            updatedParticipants[index] = { 
                ...updatedParticipants[index], // Create a shallow copy of the participant object
                [field]: value // Update the specific field
            };
            return updatedParticipants; // Return the updated array
        });
    };

    const handleRegister = async () => {
        if (teamSize > 1 && !teamName) {
            setError("Please enter a team name for team registration.");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventID, participants, teamName })
            });

            // if (!response.ok) {
            //     throw new Error("Registration failed");
            // }

            setSuccessMessage("Registration successful!"); // Show success message

            // After 3 seconds, navigate to the home page
            setTimeout(() => {
                const currentUser={ srn: newUser.srn };
                navigate("/home", { state: { currentUser } });
            }, 3000); // 3 seconds delay
        } catch (err) {
            console.error("Error during registration:", err);
            setError("An error occurred during registration.");
        }
    };

    return (
        <>
        <button
            onClick={() => {
                const currentUser = { srn: newUser.srn };
                navigate("/home", { state: { currentUser } });
            }}
            className="self-start mb-4 text-indigo-500 underline"
        >
            Back to Home
        </button>


        <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold text-center mb-4">Register for Event</h1>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            
            {successMessage && (
                <p className="text-green-500 text-center mb-4">{successMessage}</p>
            )}

            {teamSize > 1 && (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                    <input 
                        type="text" 
                        value={teamName} 
                        onChange={(e) => setTeamName(e.target.value)} 
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter your team name" 
                    />
                </div>
            )}

            {participants.map((participant, index) => (
                <div key={index} className="mb-4 p-4 border rounded-lg">
                    <h2 className="font-semibold text-lg mb-2">Participant {index + 1}</h2>
                    
                    <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">SRN</label>
                        <input 
                            type="text" 
                            value={participant.srn} 
                            onChange={(e) => handleInputChange(index, 'srn', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter SRN" 
                        />
                    </div>

                    <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input 
                            type="text" 
                            value={participant.name} 
                            onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter Name" 
                        />
                    </div>

                    <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                            type="email" 
                            value={participant.email} 
                            onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter Email" 
                        />
                    </div>

                    <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input 
                            type="text" 
                            value={participant.phone} 
                            onChange={(e) => handleInputChange(index, 'phone', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter Phone Number" 
                        />
                    </div>
                </div>
            ))}

            <button 
                onClick={handleRegister}
                className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
            >
                Register
            </button>
        </div>
        </>
    );
}

export default Register;
