import React, {useState, useEffect} from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom'

function Event_details() {
    const location = useLocation();
    const { newUser } = location.state || {};
    console.log(newUser);
    const navigate = useNavigate();
    console.log("Current User in Event_details: ", newUser);

    const [eventDetails, setEventDetails] = useState(null);

    useEffect(() => {
        setEventDetails(null); 

        if (!newUser?.eventID) {
            console.error('EventID is not available');
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/eventdetails?eventId=${newUser.eventID}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': "application/json",
                    }
                });

                const data = await response.json();
                console.log(data)
                setEventDetails(data); 

            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        }

        fetchData();

    }, [newUser]);

    if (!eventDetails) {
        return <div>Loading...</div>;  // Show a loading message waiting for it to get the data
    }
    

    const eventDate = new Date(eventDetails.Event_date);
    const getDaySuffix = (day) => {
        if (day >= 11 && day <= 13) {
            return `${day}th`;
        }
        switch (day % 10) {
            case 1:
                return `${day}st`;
            case 2:
                return `${day}nd`;
            case 3:
                return `${day}rd`;
            default:
                return `${day}th`;
        }
    };

    const day = eventDate.getDate();
    const month = eventDate.toLocaleString('default', { month: 'long' });
    const year = eventDate.getFullYear();
    const formattedEventDate = `${getDaySuffix(day)} ${month}, ${year}`;

    const formatTime = (time) => {
        const [hours, minutes] = time.split(":");
        const date = new Date();
        date.setHours(hours, minutes);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const startTimeFormatted = formatTime(eventDetails.S_time);
    const endTimeFormatted = formatTime(eventDetails.E_time);

    const handleRegister = () => {
        navigate("/register", { state: { newUser } });
    };


    return <>
        <div className="flex flex-col items-center p-4">
            <button 
                className="absolute top-32 left-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                onClick={() => navigate(-1)} 
            >
                Back
            </button>
            <div 
            className="w-full max-w-[60%] h-[63vh] bg-cover bg-center relative" 
            style={{ backgroundImage: `url(${eventDetails.Poster})`, objectFit: 'contain' }}
            >
            </div>


            <div className="mt-8 text-center max-w-4xl mx-auto">
                <h1 className="text-3xl font-semibold mb-4">{eventDetails.Ename}</h1>
                <p className="text-xl"><strong>Category:</strong> {eventDetails.Category}</p>
                <p className="text-xl"><strong>Event Date:</strong> {formattedEventDate}</p>
                <p className="text-xl"><strong>Domain:</strong> {eventDetails.Domain}</p>
                <p className="text-xl"><strong>Start Time:</strong> {startTimeFormatted}</p>
                <p className="text-xl"><strong>End Time:</strong> {endTimeFormatted}</p>
                <p className="text-xl"><strong>Team Size:</strong> {eventDetails.TeamSize}</p>
            </div>
            <div className="mt-8 w-full flex justify-end">
                <button
                        className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        onClick={handleRegister}
                    >
                    Register
                </button>
                </div>

        </div>
    </>
}

export default Event_details
