import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Event_info() {
    const location = useLocation();
    const { srn } = location.state || {}; // Get SRN from location state
    const navigate = useNavigate();

    const [events, setEvents] = useState([]); // To store event details
    const [selectedEvent, setSelectedEvent] = useState(''); // To track selected event
    const [eventID, setEventID] = useState(null); // To store the selected event ID
    const [selectedTab, setSelectedTab] = useState('participants'); // To handle which tab is selected (Participants, Organizers, etc.)
    const [eventData, setEventData] = useState([]); // To store event details (organizers, participants, etc.)
    const [selectedRow, setSelectedRow] = useState(null); // To track selected row
    const [selectedID, setSelectedID] = useState(null);  // To store the selected ID/SRN for deletion
    const [error, setError] = useState(null); // To handle errors
    const [refreshKey, setRefreshKey] = useState(0);
    const [totalAmountSpent, setTotalAmountSpent] = useState(0); // Store total amount spent

    

    const fetchEvents = async () => {
        try {
            const response = await fetch(`http://localhost:8080/events/organizingdetails?srn=${srn.srn}`);
            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }
            const data = await response.json();
            // console.log(data);
            setEvents(data); // Store event details
        } catch (error) {
            console.error("Error fetching event details:", error);
            setError("An error occurred while fetching event details.");
        }
    };


    useEffect(() => {
        console.log("srn in useeffect: ", srn);
        if (srn) {
            fetchEvents(); // Fetch events if SRN is available
        }
    }, [srn]);


    useEffect(() => {
        console.log("in useeffect!!!!");
        const fetchEventData = async () => {
            console.log("eventID: ", eventID);
            console.log("in fetch event data function!!");
            if (eventID) {
                try {
                    let url = '';
                    switch (selectedTab) {
                        case 'organizers':
                            url = `http://localhost:8080/events/organizers?eventID=${eventID}`;
                            break;
                        case 'participants':
                            url = `http://localhost:8080/events/participants?eventID=${eventID}`;
                            break;
                        case 'sponsors':
                            url = `http://localhost:8080/events/sponsors?eventID=${eventID}`;
                            break;
                        case 'guests':
                            url = `http://localhost:8080/events/guests?eventID=${eventID}`;
                            break;
                        case 'finances':
                            url = `http://localhost:8080/events/finances?eventID=${eventID}`;
                            break;
                        default:
                            return;
                    }
                    console.log("url: ", url);
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error('Failed to fetch event data');
                    }
                    const data = await response.json();
                    console.log("data!!!: ", data);
                    console.log("selectedTab: ", selectedTab);
                    if (selectedTab === 'finances') {
                        setEventData(data.finances); // Setting the finance data
                        setTotalAmountSpent(data.totalAmountSpent); // Setting the total amount spent
                    } else {
                        console.log("not finance!");
                        setEventData(data); // For other tabs, just set the event data
                    }
                    console.log("eventData: ", eventData);

                } catch (error) {
                    console.error("Error fetching event data:", error);
                    setError("An error occurred while fetching event data.");
                }
            }
        };

        fetchEventData();
    }, [eventID, selectedTab, refreshKey]);

    const handleSelectChange = (event) => {
        const selectedEvent = event.target.value;
        setSelectedEvent(selectedEvent);
        console.log("selectedEvent: ", selectedEvent);
        const selectedEventObj = events.find(ev => ev.ename === selectedEvent);
        console.log("selectedEventObj: ", selectedEventObj);
        if (selectedEventObj) {
            console.log("ghwuroghwrougrwhugowroguruwrogorw");
            setEventID(selectedEventObj.eventId); // Set the eventID when a new event is selected
            console.log("EventID!!!: ", selectedEventObj.eventId);
        }
        // console.log("EVENT DATA!!!!!!!!: ", eventData);
        setEventData([]);
    };

    const handleTabChange = (tab) => {
        setSelectedTab(tab); // Change the selected tab (Participants, Organizers, etc.)
        setEventData([]); // Clear data when changing tab
        if (tab === 'finances') {
            setTotalAmountSpent(0); // Reset total amount spent when finances tab is selected
        }
    };

    useEffect(() => {
        if (selectedID !== null) {
            console.log("Updated selected ID:", selectedID);
        }
    }, [selectedID]);

    const handleRowClick = (index, item) => {
        setSelectedRow(index); // Select the row
        const currId = item?.id?.srn || item?.id?.id || item?.financeId?.transID || item?.srn || item?.guestId.id; 
        console.log("item: ", item);
        console.log("item ID: ", currId);
        setSelectedID(currId); // Set the selected ID/SRN for deletion
    };

    const handleDelete = async () => {
        // console.log("while deleting selectedID: ", selectedID);
        if (!selectedID) {
            alert("Please select a row to delete.");
            return;
        }

        let url = '';
        let curID;


        // Set URL and body based on the selected tab
        switch (selectedTab) {
            case 'organizers':
                url = 'http://localhost:8080/events/deleteorganizer';
                curID = { id: { srn: selectedID, eventId: eventID } };
                break;
            case 'participants':
                url = 'http://localhost:8080/events/deleteparticipant';
                curID = { id: { srn: selectedID, eventID: eventID } };
                break;
            case 'sponsors':
                url = 'http://localhost:8080/events/deletesponsor';
                curID = { id: { id: selectedID, eventID: eventID } };
                break;
            case 'finances':
                url = 'http://localhost:8080/events/deletefinance';
                curID = { financeId: { transID: selectedID, eventID: eventID } };
                break;
            case 'guests':
                url = 'http://localhost:8080/events/deleteguest';
                curID = { guestId: { id: selectedID, eventID: eventID } };
                break;
            default:
                return;
        }

        // Send the DELETE request
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(curID),
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message); // Show success message

                // Remove deleted item from the UI
                setEventData((prevData) => prevData.filter(item => item.ID !== selectedID && item.srn !== selectedID));

                // Reset selected ID and row
                setSelectedID(null);
                setSelectedRow(null);

                setEventData([]);
                console.log("eventData: ",eventData);
                setRefreshKey(prev => prev + 1);
            }

        } catch (error) {
            console.error("Error deleting data:", error);
            alert("An error occurred while deleting data.");
        }
    };

    const handleInsert = () => {
        if (eventID) {
            const currentUser={ tab: selectedTab, eventID: eventID,  srn: srn.srn};
            navigate("/insert", { state: { currentUser } });
        } else {
            alert("Please select an event before inserting details.");
        }
    };

    const handleUpdate = async () => {
        if (eventID && selectedID) {
            const currentUser={ tab: selectedTab, eventID: eventID,  srn: srn.srn, ID: selectedID};
            navigate("/update", { state: { currentUser } });
        } else if(!eventID){
            alert("Please select an event before updating details.");
        } else{
            alert("Please select a row before updating details.");
        }
    };


    const handleDeleteEvent = async () => {
        // console.log(eventID);    
        try {
            const response = await fetch('http://localhost:8080/events/deleteevent', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId: eventID })
            });
    
            if (response.ok) {
                const message = await response.text();
                alert(message); // Show success message
            } else {
                const errorMessage = await response.text();
                alert(`Error: ${errorMessage}`);
            }

            fetchEvents();

        } catch (err) {
            console.error("Error occurred while deleting the event:", err);
            alert("An error occurred. Please try again.");
        }
    };

    console.log("eventData", eventData);
    

    return (
        <div>
            <button
                onClick={() => {
                    const currentUser = { srn: srn.srn };
                    navigate("/home", { state: { currentUser } });
                }}
                className="self-start mb-4 text-indigo-500 underline"
            >
                Back to Home
            </button>

            <div>
                <label htmlFor="event-select" className="block text-sm font-medium text-gray-700 mb-2">Select Event</label>
                <select
                    id="event-select"
                    value={selectedEvent}
                    onChange={handleSelectChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="">-- Select an Event --</option>
                    {events.map((event, index) => (
                        <option key={index} value={event.ename}>
                            {event.ename}
                        </option>
                    ))}
                </select>
            </div>

            <div className="my-4 flex justify-between">
                <div className="flex space-x-4">
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg"
                    >
                        Delete
                    </button>
                    {['sponsors', 'finances', 'guests'].includes(selectedTab) && (
                        <button
                            onClick={handleUpdate}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                        >
                            Update
                        </button>
                    )}
                    {['sponsors', 'finances', 'guests'].includes(selectedTab) && (
                        <button
                            onClick={handleInsert}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg"
                        >
                            Insert
                        </button>
                    )}
                </div>
                <button
                    onClick={handleDeleteEvent}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                    Delete Event
                </button>
            </div>

            <div className="my-4">
                <button
                    onClick={() => handleTabChange('participants')}
                    className={`px-4 py-2 ${selectedTab === 'participants' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Participants
                </button>
                <button
                    onClick={() => handleTabChange('organizers')}
                    className={`px-4 py-2 ${selectedTab === 'organizers' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Organizers
                </button>
                <button
                    onClick={() => handleTabChange('sponsors')}
                    className={`px-4 py-2 ${selectedTab === 'sponsors' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Sponsors
                </button>
                <button
                    onClick={() => handleTabChange('finances')}
                    className={`px-4 py-2 ${selectedTab === 'finances' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Finances
                </button>
                <button
                    onClick={() => handleTabChange('guests')}
                    className={`px-4 py-2 ${selectedTab === 'guests' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Guests
                </button>
            </div>

            {eventID && (
                <div>
                    <h3 className="font-semibold text-lg">{selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}</h3>
                    {eventData.length > 0 ? (
                        <table className="min-w-full table-auto border-collapse">
                            <thead>
                                <tr>
                                    {Array.isArray(eventData[0])
                                        ? Object.keys(eventData[0][0] || {}).map((key) => ( // Adjust for participant data
                                            <th key={key} className="px-4 py-2">{key}</th>
                                        ))
                                        : Object.keys(eventData[0]).map((key) => ( // Adjust for other data
                                            <th key={key} className="px-4 py-2">{key}</th>
                                        ))
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {eventData.map((item, index) => (
                                    <tr
                                        key={index}
                                        onClick={() => handleRowClick(index, item)}
                                        className={`cursor-pointer ${selectedRow === index ? 'bg-gray-300' : ''}`}
                                    >
                                        {Object.entries(item).map(([key, value], idx) => (
                                            <td key={idx} className="border px-4 py-2">
                                                {typeof value === "object" && value !== null
                                                ? (value.srn || value.transID || value.id || "N/A") // Only show `srn` and ignore `eventID`
                                                : String(value)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No data available for this tab.</p>
                    )}
                    {selectedTab === 'finances' && (
                        <div className="mt-4 text-right font-semibold">
                            Total Expenses = {totalAmountSpent}
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}

export default Event_info;
