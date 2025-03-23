package com.example.demo;

import jakarta.persistence.*;

@Entity
@Table(name = "teams")
public class Team {
    
    @Id
    @Column(name = "TeamID", length = 20, nullable = false)
    private String teamID;

    @Column(name = "Team_name", length = 100, nullable = false)
    private String teamName;

    @Column(name = "EventID", length = 20, nullable = false)
    private String eventID;

    public Team() {}

    public Team(String teamID, String teamName, String eventID) {
        this.teamID = teamID;
        this.teamName = teamName;
        this.eventID = eventID;
    }

    // Getters and Setters
    public String getTeamID() { return teamID; }
    public void setTeamID(String teamID) { this.teamID = teamID; }

    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }

    public String getEventID() { return eventID; }
    public void setEventID(String eventID) { this.eventID = eventID; }
}
