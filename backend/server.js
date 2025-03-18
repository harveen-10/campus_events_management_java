import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from 'mysql2';
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const port = 3000;
const saltRounds = 10;

const corsOptions = {
    origin: "http://localhost:5173",
    methods: "GET, POST",
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

// Create a connection to the MySQL database
const db = mysql.createConnection({
    host: 'localhost',     
    user: 'root',           
    password: process.env.PASSWORD, 
    database: process.env.DATABASE 
}).promise();

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to MySQL database!');
});

// for the home pg components
app.get("/home", async (req, res) => {
    try {
        const [products] = await db.query("SELECT Ename, Event_date, Poster, EventID FROM events ORDER BY Event_date ASC, s_time ASC");
        res.send({ products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Error fetching products");
    } 
});


// detailed description of the events
app.get("/eventdetails", async (req, res) => {
    const eventId = req.query.eventId;

    if (!eventId) {
        return res.status(400).send("EventID is required.");
    }

    try {
        const [rows] = await db.query("SELECT Ename, Category, Event_date, Domain, Poster, S_time, E_time, TeamSize FROM events WHERE EventID = ?", [eventId]);

        if (rows.length === 0) {
            return res.status(404).send("Event not found.");
        }
        return res.json(rows[0]);
    } catch (err) {
        console.error("Error fetching event details: ", err);
        return res.status(500).send("An error occurred while fetching event details.");
    }
});


// Details of all the events the organizer is organizing
app.get("/organizingdetails", async (req, res) => {
    const srn = req.query.srn;

    if (!srn) {
        return res.status(400).send("SRN is required.");
    }

    try {
        // Fetch event details organized by the provided SRN using a nested query
        const [events] = await db.query(
            `SELECT Ename, Event_date, Poster, EventID 
             FROM events 
             WHERE EventID IN (
                 SELECT EventID 
                 FROM organized_by 
                 WHERE SRN = ?
             )`,
            [srn]
        );

        if (events.length === 0) {
            return res.status(404).send("No events found.");
        }

        return res.json(events);
    } catch (err) {
        console.error("Error fetching event details: ", err);
        return res.status(500).send("An error occurred while fetching event details.");
    }
});



// Details of all the organizers organizing an event
app.get("/organizers", async (req, res) => {
    const eventID = req.query.eventID;

    if (!eventID) {
        return res.status(400).send("EventID is required.");
    }

    try {
        // Get all SRNs of organizers for the provided EventID
        const [organizerSRNs] = await db.query("SELECT SRN FROM organized_by WHERE EventID = ?", [eventID]);

        if (organizerSRNs.length === 0) {
            return res.status(404).send("No organizers found for this event.");
        }

        // Extract the SRNs
        const srnList = organizerSRNs.map(row => row.SRN);

        // Fetch details (SRN, name, email, phone_no) for all organizers whose SRN is in the list
        const [organizers] = await db.query(
            "SELECT SRN, Name, Email, phone_no FROM organizers WHERE SRN IN (?)",
            [srnList]
        );

        return res.json(organizers);
    } catch (err) {
        console.error("Error fetching organizers details: ", err);
        return res.status(500).send("An error occurred while fetching organizers details.");
    }
});


// Details of all the participants participating in the event
app.get("/participants", async (req, res) => {
    const eventID = req.query.eventID;
    console.log(eventID);

    if (!eventID) {
        return res.status(400).send("EventID is required.");
    }

    try {
        const [results] = await db.query("CALL GetParticipantsByEvent(?)", [eventID]);
        const participants = results[0];

        if (!participants || participants.length === 0) {
            return res.status(404).send("No participants found for this event.");
        }

        return res.json(participants);
    } catch (err) {
        console.error("Error fetching participants details: ", err);
        return res.status(500).send("An error occurred while fetching participants details.");
    }
});



// Details of all the sponsors of an event
app.get("/sponsors", async (req, res) => {
    const eventID = req.query.eventID;

    if (!eventID) {
        return res.status(400).send("EventID is required.");
    }

    try {
        // Fetch sponsor details for the specified event
        const [sponsors] = await db.query(
            "SELECT ID,Name, Email, Contribution, phone_no FROM sponsors WHERE EventID = ?",
            [eventID]
        );

        if (sponsors.length === 0) {
            return res.status(404).send("No sponsors found for this event.");
        }

        return res.json(sponsors);
    } catch (err) {
        console.error("Error fetching sponsor details: ", err);
        return res.status(500).send("An error occurred while fetching sponsor details.");
    }
});


// Details of all the guests of an event
app.get("/guests", async (req, res) => {
    const eventID = req.query.eventID;

    if (!eventID) {
        return res.status(400).send("EventID is required.");
    }

    try {
        // Fetch guest details for the specified event
        const [guests] = await db.query(
            "SELECT ID, Name, Email, Role, phone_no FROM guests WHERE EventID = ?",
            [eventID]
        );

        if (guests.length === 0) {
            return res.status(404).send("No guests found for this event.");
        }

        return res.json(guests);
    } catch (err) {
        console.error("Error fetching guest details: ", err);
        return res.status(500).send("An error occurred while fetching guest details.");
    }
});

// Details of all the finances of an event and the total amount spent
app.get("/finances", async (req, res) => {
    const eventID = req.query.eventID;

    if (!eventID) {
        return res.status(400).send("EventID is required.");
    }

    try {
        // Fetch finance details for the specified event
        const [finances] = await db.query(
            "SELECT TransID, SpentOn, Amount, Receipt FROM finances WHERE EventID = ?",
            [eventID]
        );

        if (finances.length === 0) {
            return res.status(404).send("No finance details found for this event.");
        }

        // Fetch the total amount spent on the event using an aggregate query
        const [totalAmountResult] = await db.query(
            "SELECT SUM(Amount) AS TotalAmount FROM finances WHERE EventID = ?",
            [eventID]
        );

        const totalAmount = totalAmountResult[0].TotalAmount;
        console.log("totalAmount: ", totalAmount);
        // Return both the finance details and total amount spent
        return res.json({
            finances: finances,
            totalAmountSpent: totalAmount || 0  // In case of no finances, return 0
        });

    } catch (err) {
        console.error("Error fetching finance details: ", err);
        return res.status(500).send("An error occurred while fetching finance details.");
    }
});


// Get sponsor details by SponsorID
app.get("/sponsorByID", async (req, res) => {
    const sponsorID = req.query.ID;
    console.log(sponsorID);

    if (!sponsorID) {
        return res.status(400).send("SponsorID is required.");
    }

    try {
        // Call the stored procedure with the provided SponsorID
        const [results] = await db.query("CALL GetSponsorByID(?)", [sponsorID]);

        // Check if a sponsor was found
        if (results.length === 0) {
            return res.status(404).send("Sponsor not found.");
        }

        // Return sponsor data
        return res.json(results[0]);
    } catch (err) {
        console.error("Error fetching sponsor details by ID: ", err);
        return res.status(500).send("An error occurred while fetching sponsor details.");
    }
});

// Get guest details by GuestID
app.get("/GuestByID", async (req, res) => {
    const guestID = req.query.ID;
    console.log(guestID);

    if (!guestID) {
        return res.status(400).send("guestID is required.");
    }

    try {
        // Call the stored procedure with the provided SponsorID
        const [results] = await db.query("CALL GetGuestByID(?)", [guestID]);

        // Check if a sponsor was found
        if (results.length === 0) {
            return res.status(404).send("Guest not found.");
        }

        // Return sponsor data
        return res.json(results[0]);
    } catch (err) {
        console.error("Error fetching guest details by ID: ", err);
        return res.status(500).send("An error occurred while fetching guest details.");
    }
});

// Get finance details by TransID
app.get("/FinanceByID", async (req, res) => {
    const FinanceID = req.query.TransID;
    console.log(FinanceID);

    if (!FinanceID) {
        return res.status(400).send("TransID is required.");
    }

    try {
        // Call the stored procedure with the provided SponsorID
        const [results] = await db.query("CALL GetFinanceByID(?)", [FinanceID]);

        // Check if a sponsor was found
        if (results.length === 0) {
            return res.status(404).send("finance not found.");
        }

        // Return sponsor data
        return res.json(results[0]);
    } catch (err) {
        console.error("Error fetching finance details by ID: ", err);
        return res.status(500).send("An error occurred while fetching finance details.");
    }
});



app.post("/signup", async (req, res) => {
    const srn = req.body.srn;
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    if (!srn) {
        return res.status(400).send("SRN is required");
    }

    try {
        const hash = await bcrypt.hash(password, saltRounds);

        await db.query("CALL signupUser(?, ?, ?, ?)", [srn, email, name, hash]);
        
        return res.send("Signup successful");
    } catch (err) {
        if (err.sqlState === '45000') {
            return res.status(400).send("This SRN already exists. Try logging in.");
        }
        console.error("Error during signup: ", err);
        return res.status(500).send("An error occurred during signup");
    }
});


app.post("/login", async (req, res) => {
    const srn = req.body.srn;
    const password = req.body.password;

    if (!srn) {
        return res.status(400).send("SRN is required");
    }

    try {
        const [rows] = await db.query("CALL getUserBySRN(?)", [srn]);

        if (rows[0].length > 0) {
            const passwordStored = rows[0][0].password;

            bcrypt.compare(password, passwordStored, (err, result) => {
                if (err) {
                    console.log("Error comparing password:", err);
                    res.status(500).send("Internal server error");
                } else {
                    if (result) {
                        res.send("Login successful");
                    } else {
                        res.send("Incorrect password");
                    }
                }
            });
        } else {
            res.send("User not found");
        }
    } catch (err) {
        console.log("Error executing stored procedure:", err);
        res.status(500).send("Error checking user");
    }
});

// creating a new event
app.post("/newevent", async (req, res) => {
    const ename = req.body.ename;
    const category = req.body.category;
    const event_date = req.body.event_date;
    const domain = req.body.domain;
    const poster = req.body.poster;
    const s_time = req.body.s_time;
    const e_time = req.body.e_time;
    const teamSize = req.body.teamSize;

    // Validate required fields
    if (!ename || !category || !event_date || !domain || !poster || !s_time || !e_time || !teamSize) {
        return res.status(400).send("All fields are required.");
    }

    try {
        // Call the stored procedure
        await db.query(
            "CALL insertNewEvent(?, ?, ?, ?, ?, ?, ?, ?, @EventID, @ecode);",
            [ename, category, event_date, domain, poster, s_time, e_time, teamSize]
        );

        // Fetch the generated EventID and ecode
        const [rows] = await db.query("SELECT @EventID AS EventID, @ecode AS ecode;");

        // Return success response
        return res.json({
            EventID: rows[0].EventID,
            ecode: rows[0].ecode,
        });
    } catch (err) {
        // Handle MySQL SIGNAL errors
        if (err.code === "ER_SIGNAL_EXCEPTION") {
            console.error("Procedure error:", err.message);
            return res.status(400).send(err.message); // Return the error message from the procedure
        }

        // Handle unexpected errors
        console.error("Error during event creation:", err);
        return res.status(500).send("An error occurred during event creation.");
    }
});


// registering for an event
app.post("/register", async (req, res) => {
    const eventID = req.body.eventID;
    const participants = req.body.participants;
    const teamName = req.body.teamName;
    console.log("eventID", eventID);
    console.log("participants", participants);
    console.log("teamName", teamName);

    if (!eventID || !participants || participants.length === 0) {
        return res.status(400).send("EventID and participant details are required.");
    }

    try {
        const [eventRows] = await db.query("SELECT TeamSize FROM events WHERE EventID = ?", [eventID]);
        if (eventRows.length === 0) {
            return res.status(404).send("Event not found.");
        }
        const teamSize = eventRows[0].TeamSize;
        console.log("Retrieved teamSize:", teamSize); 

        let teamID = null;
        if (teamSize > 1) {
            teamID = Math.random().toString(36).substring(2, 8); 
            await db.query("INSERT INTO teams (TeamID, Team_name, EventID) VALUES (?, ?, ?)", [teamID, teamName, eventID]);
        }

        const participantQueries = participants.map((participant) => 
            db.query("INSERT INTO participants (SRN, Name, Email, phone_no, EventID, TeamID) VALUES (?, ?, ?, ?, ?, ?)", 
                     [participant.srn, participant.name, participant.email, participant.phone, eventID, teamID])
        );

        await Promise.all(participantQueries);

        res.status(201).send("Registration successful.");
    } catch (err) {
        console.error("Error during registration: ", err);
        res.status(500).send("An error occurred during registration.");
    }
});

// new organizer for an existing event
app.post("/addorganizer", async (req, res) => {
    const srn = req.body.srn;
    const ename = req.body.ename;
    const ecode = req.body.ecode;
    const name = req.body.name;
    const email = req.body.email;
    const phone_no = req.body.phone_no;

    if (!srn || !ename || !ecode || !name || !email || !phone_no) {
        return res.status(400).send("All fields are required.");
    }

    try {
        // Check if the event exists and get the EventID by Event Name (ename)
        const [eventRows] = await db.query("SELECT EventID, ecode FROM events WHERE Ename = ?", [ename]);

        if (eventRows.length === 0) {
            return res.status(404).send("Event not found.");
        }

        const eventID = eventRows[0].EventID;
        const eventEcode = eventRows[0].ecode;
        console.log("Actual ecode", eventEcode);

        // Check if the ecode matches
        if (ecode !== eventEcode) {
            return res.status(400).send("The ecode entered is incorrect.");
        }

        // Check if the organizer already exists in the organizers table
        const [existingOrganizer] = await db.query(
            "SELECT * FROM organizers WHERE SRN = ? OR Email = ? OR phone_no = ?",
            [srn, email, phone_no]
        );

        if (existingOrganizer.length === 0) {
            // If the organizer doesn't exist, insert them into the organizers table
            await db.query(
                "INSERT INTO organizers (Name, SRN, Email, phone_no) VALUES (?, ?, ?, ?)",
                [name, srn, email, phone_no]
            );
        }

        // Now add the organizer to the organized_by table
        await db.query("INSERT INTO organized_by (SRN, EventID) VALUES (?, ?)", [srn, eventID]);

        return res.send("Organizer added successfully.");
    } catch (err) {
        // Check if the error is a duplicate entry error
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).send("This organizer is already assigned to the event.");
        }
        console.error("Error adding organizer: ", err);
        return res.status(500).send("An error occurred while adding the organizer.");
    }
});




// Insert details of the sponsors of an event
app.post("/sponsorinsert", async (req, res) => {
    const Name = req.body.Name;
    const Email = req.body.Email;
    const Contribution = req.body.Contribution;
    const phone_no = req.body.phone_no;
    const EventID = req.body.EventID;
    console.log(Name);
    console.log(Email);
    console.log(Contribution);
    console.log(phone_no);
    console.log(EventID);

    if (!Name || !Email || !Contribution || !phone_no || !EventID) {
        return res.status(400).send("All sponsor details (Name, Email, Contribution, phone_no, EventID) are required.");
    }

    try {
        // Call the stored procedure to insert sponsor details
        await db.query("CALL InsertSponsor(?, ?, ?, ?, ?)", [Name, Email, Contribution, phone_no, EventID]);

        // Return a success message
        return res.status(201).json({
            message: "Sponsor added successfully",
            sponsor: { Name, Email, Contribution, phone_no, EventID }
        });

    } catch (err) {
        console.error("Error adding sponsor details: ", err);
        return res.status(500).send("An error occurred while adding sponsor details.");
    }
});

// Insert details of the guests of an event
app.post("/guestinsert", async (req, res) => {
    const Name = req.body.Name;
    const Email = req.body.Email;
    const Role = req.body.Role;
    const phone_no = req.body.phone_no;
    const EventID = req.body.EventID;

    if (!Name || !Email || !Role || !phone_no || !EventID) {
        return res.status(400).send("All guest details (Name, Email, Role, phone_no, EventID) are required.");
    }

    try {
        // Call the stored procedure to insert guest details
        await db.query("CALL InsertGuest(?, ?, ?, ?, ?)", [Name, Email, Role, phone_no, EventID]);

        // Return a success message
        return res.status(201).json({
            message: "Guest added successfully",
            guest: { Name, Email, Role, phone_no, EventID }
        });

    } catch (err) {
        console.error("Error adding guest details: ", err);
        return res.status(500).send("An error occurred while adding guest details.");
    }
});

// Insert details of the finances of an event
app.post("/financeinsert", async (req, res) => {
    const SpentOn = req.body.SpentOn;
    const Amount = req.body.Amount;
    const Receipt = req.body.Receipt;
    const EventID = req.body.EventID;

    if (!SpentOn || !Amount || !Receipt || !EventID) {
        return res.status(400).send("All finance details (SpentOn, Amount, Receipt, EventID) are required.");
    }

    try {
        // Call the stored procedure to insert finance details
        await db.query("CALL InsertFinance(?, ?, ?, ?)", [SpentOn, Amount, Receipt, EventID]);

        // Return a success message
        return res.status(201).json({
            message: "Finance details added successfully",
            finance: { SpentOn, Amount, Receipt, EventID }
        });

    } catch (err) {
        console.error("Error adding finance details: ", err);
        return res.status(500).send("An error occurred while adding finance details.");
    }
});



// Update details of the guests of an event
app.post("/guestupdate", async (req, res) => {
    const Name = req.body.Name;
    const Email = req.body.Email;
    const Role = req.body.Role;
    const phone_no = req.body.phone_no;
    const ID = req.body.ID;
    console.log(Name);
    console.log(Email);
    console.log(Role);
    console.log(phone_no);
    console.log(ID);
    

    // Validate that all necessary fields are provided
    if (!ID || !Name || !Email || !Role || !phone_no) {
        return res.status(400).send("All guest details (ID, Name, Email, Role, phone_no) are required.");
    }

    try {
        // Check if a guest record with the provided ID exists
        const [rows] = await db.query("SELECT * FROM guests WHERE ID = ?", [ID]);

        if (rows.length === 0) {
            return res.status(404).send("No guest found with the provided ID.");
        }

        // Update the guest details using the provided ID
        const result = await db.query(
            "UPDATE guests SET Name = ?, Email = ?, Role = ?, phone_no = ? WHERE ID = ?",
            [Name, Email, Role, phone_no, ID]
        );

        // Check if the update was successful
        if (result.affectedRows === 0) {
            return res.status(404).send("Failed to update guest details for the provided ID.");
        }

        // Return a success message along with the updated guest details
        return res.status(200).json({
            message: "Guest details updated successfully",
            guest: { ID, Name, Email, Role, phone_no }
        });
    } catch (err) {
        console.error("Error updating guest details: ", err);
        return res.status(500).send("An error occurred while updating guest details.");
    }
});



// Update details of the sponsors of an event
app.post("/sponsorupdate", async (req, res) => {
    const Name= req.body.Name;
    const Email= req.body.Email;
    const Contribution= req.body.Contribution;
    const phone_no= req.body.phone_no;
    const ID= req.body.ID;
    console.log(Name);
    console.log(Email);
    console.log(Contribution);
    console.log(phone_no);
    console.log(ID);

    // Validate that all necessary fields are provided
    if (!ID || !Name || !Email || !Contribution || !phone_no) {
        return res.status(400).send("All sponsor details (ID, Name, Email, Contribution, phone_no) are required.");
    }

    try {
        // Check if a sponsor with the given ID exists
        const [rows] = await db.query("SELECT * FROM sponsors WHERE ID = ?", [ID]);

        if (rows.length === 0) {
            return res.status(404).send("No sponsor found with the provided ID.");
        }

        // Update the sponsor details
        const result = await db.query(
            "UPDATE sponsors SET Name = ?, Email = ?, Contribution = ?, phone_no = ? WHERE ID = ?",
            [Name, Email, Contribution, phone_no, ID]
        );

        console.log("what is this here: ", result.affectedRows);

        // Check if the update was successful
        if (result.affectedRows === 0) {
            return res.status(404).send("No sponsor found with the provided ID to update.");
        }

        // Return a success message along with the updated sponsor details
        return res.status(200).json({
            message: "Sponsor details updated successfully",
            sponsor: { ID, Name, Email, Contribution, phone_no }
        });
    } catch (err) {
        console.error("Error updating sponsor details: ", err);
        return res.status(500).send("An error occurred while updating sponsor details.");
    }
});


// Update details of the finances of an event
app.post("/financeupdate", async (req, res) => {
    const SpentOn = req.body.SpentOn;
    const Amount = req.body.Amount;
    const Receipt = req.body.Receipt;
    const ID = req.body.ID;
    console.log(SpentOn);
    console.log(Amount);
    console.log(Receipt);
    console.log(ID);

    // Validate that all necessary fields are provided
    if (!ID || !SpentOn || !Amount || !Receipt) {
        return res.status(400).send("All finance details (ID, SpentOn, Amount, Receipt) are required.");
    }

    try {
        // Check if a finance record with the given ID exists
        const [rows] = await db.query("SELECT * FROM finances WHERE TransID = ?", [ID]);

        if (rows.length === 0) {
            return res.status(404).send("No finance record found with the provided ID.");
        }

        // Update the finance details
        const result = await db.query(
            "UPDATE finances SET SpentOn = ?, Amount = ?, Receipt = ? WHERE TransID = ?",
            [SpentOn, Amount, Receipt, ID]
        );

        // Check if the update was successful
        if (result.affectedRows === 0) {
            return res.status(404).send("No finance record found with the provided ID to update.");
        }

        // Return a success message along with the updated finance details
        return res.status(200).json({
            message: "Finance details updated successfully",
            finance: { ID, SpentOn, Amount, Receipt }
        });
    } catch (err) {
        console.error("Error updating finance details: ", err);
        return res.status(500).send("An error occurred while updating finance details.");
    }
});

// Delete finance details from the finances table by TransID
app.post("/financedelete", async (req, res) => {
    const TransID = req.body.TransID;
    console.log(TransID);

    // Check if TransID is provided
    if (!TransID) {
        return res.status(400).send("TransID is required to delete finance details.");
    }

    try {
        // Execute the DELETE query directly without using a stored procedure
        const result = await db.query("DELETE FROM finances WHERE TransID = ?", [TransID]);

        // Check if any rows were affected (deleted)
        if (result.affectedRows === 0) {
            return res.status(404).send("Finance details not found for the given TransID.");
        }

        // Return a success message
        return res.status(200).json({
            message: "Finance details deleted successfully",
            TransID: TransID
        });

    } catch (err) {
        console.error("Error deleting finance details: ", err);
        return res.status(500).send("An error occurred while deleting finance details.");
    }
});


// Delete sponsor details from the sponsors table by SponsorID
app.post("/sponsordelete", async (req, res) => {
    const SponsorID = req.body.SponsorID;

    // Check if SponsorID is provided
    if (!SponsorID) {
        return res.status(400).send("SponsorID is required to delete sponsor details.");
    }

    try {
        // Execute the SQL query directly to delete sponsor details based on SponsorID
        const result = await db.query("DELETE FROM sponsors WHERE ID = ?", [SponsorID]);

        // Return a success message
        return res.status(200).json({
            message: "Sponsor details deleted successfully",
            SponsorID: SponsorID
        });

    } catch (err) {
        console.error("Error deleting sponsor details: ", err);
        return res.status(500).send("An error occurred while deleting sponsor details.");
    }
});


// Delete guest details from the guests table by GuestID
app.post("/guestdelete", async (req, res) => {
    const GuestID = req.body.GuestID;

    // Check if GuestID is provided
    if (!GuestID) {
        return res.status(400).send("GuestID is required to delete guest details.");
    }

    try {
        // Execute the SQL query directly to delete guest details based on GuestID
        const [result] = await db.query("DELETE FROM guests WHERE ID = ?", [GuestID]);

        // Check if any rows were affected (i.e., if the GuestID exists)
        if (result.affectedRows === 0) {
            return res.status(404).send("Guest not found with the provided GuestID.");
        }

        // Return a success message
        return res.status(200).json({
            message: "Guest details deleted successfully",
            GuestID: GuestID
        });

    } catch (err) {
        console.error("Error deleting guest details: ", err);
        return res.status(500).send("An error occurred while deleting guest details.");
    }
});


// Delete an organizer from the organized_by table by SRN
app.post("/deleteorganizerfromevent", async (req, res) => {
    const SRN = req.body.SRN;
    console.log(SRN);

    // Check if SRN is provided
    if (!SRN) {
        return res.status(400).send("SRN is required to delete the organizer from the event.");
    }

    try {
        // Call the stored procedure to delete the organizer entry from organized_by table
        const [result] = await db.query("CALL DeleteOrganizerFromEvent(?)", [SRN]);

        // Check if any rows were affected (i.e., if the SRN exists in organized_by)
        if (result.affectedRows === 0) {
            return res.status(404).send("No entry found for the provided SRN in the organized_by table.");
        }

        // Return a success message
        return res.status(200).json({
            message: "Organizer entry deleted successfully from the event",
            SRN: SRN
        });

    } catch (err) {
        console.error("Error deleting organizer entry from event: ", err);
        return res.status(500).send("An error occurred while deleting the organizer entry from the event.");
    }
});

// Delete participant details from the participants table by SRN
app.post("/participantdelete", async (req, res) => {
    const SRN= req.body.SRN;

    // Check if SRN is provided
    if (!SRN) {
        return res.status(400).send("SRN is required to delete participant details.");
    }

    try {
        // Call the stored procedure to delete participant details based on SRN
        await db.query("CALL DeleteParticipantBySRN(?)", [SRN]);

        // Return a success message
        return res.status(200).json({
            message: "Participant details deleted successfully",
            SRN: SRN
        });

    } catch (err) {
        console.error("Error deleting participant details: ", err);
        return res.status(500).send("An error occurred while deleting participant details.");
    }
});

// Delete an event by EventID
app.post("/deleteevent", async (req, res) => {
    const EventID = req.body.EventID;
    console.log(EventID);

    if (!EventID) {
        return res.status(400).send("EventID is required.");
    }

    try {
        // Delete the event by EventID
        const [result] = await db.query("DELETE FROM events WHERE EventID = ?", [EventID]);

        // Check if the event was deleted
        if (result.affectedRows === 0) {
            return res.status(404).send("Event not found.");
        }

        // Success response
        return res.status(200).send("Event and related data deleted successfully.");
    } catch (err) {
        console.error("Error deleting event: ", err);
        return res.status(500).send("An error occurred while deleting the event.");
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
