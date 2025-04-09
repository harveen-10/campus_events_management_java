package com.example.demo;

import java.util.List;

public class RegistrationRequest {
    private String eventID;
    private List<ParticipantDTO> participants;
    private String teamName;

    // Getters and Setters
    public String getEventID() { return eventID; }
    public void setEventID(String eventID) { this.eventID = eventID; }

    public List<ParticipantDTO> getParticipants() { return participants; }
    public void setParticipants(List<ParticipantDTO> participants) { this.participants = participants; }

    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }
}
