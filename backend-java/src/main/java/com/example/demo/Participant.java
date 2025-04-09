package com.example.demo;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;


@Entity
@Table(name = "participants")
public class Participant {

    @EmbeddedId
    private ParticipantId id;  // Composite Key (srn + eventID)

    @Column(name = "Name", length = 100)
    private String name;

    @Column(name = "Email", length = 100)
    private String email;

    @Column(name = "TeamID", length = 20)
    private String teamID;

    @Column(name = "phone_no", length = 10)
    private String phoneNo;

    // Constructors
    public Participant() {}

    public Participant(ParticipantId id, String name, String email, String teamID, String phoneNo) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.teamID = teamID;
        this.phoneNo = phoneNo;
    }

    // Getters and Setters
    public ParticipantId getId() { return id; }
    public void setId(ParticipantId id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTeamID() { return teamID; }
    public void setTeamID(String teamID) { this.teamID = teamID; }

    public String getPhoneNo() { return phoneNo; }
    public void setPhoneNo(String phoneNo) { this.phoneNo = phoneNo; }
}
