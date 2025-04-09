package com.example.demo;

import jakarta.persistence.*;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @Column(name = "EventID", length = 20)
    private String eventId;

    @Column(name = "Ename", length = 100, nullable = false)
    private String ename;

    @Column(name = "Category", length = 50, nullable = false)
    private String category;

    @Column(name = "Event_date")
    private String eventDate;

    @Column(name = "Domain", length = 50)
    private String domain;

    @Column(name = "Poster", columnDefinition = "TEXT")
    private String poster;

    @Column(name = "s_time")
    private String startTime;

    @Column(name = "e_time")
    private String endTime;

    @Column(name = "ecode", length = 20)
    private String ecode;

    @Column(name = "\"TeamSize\"") // Use double quotes to force exact name
    private Integer teamSize;
 

    // Getters and Setters
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }

    public String getEname() { return ename; }
    public void setEname(String ename) { this.ename = ename; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getEventDate() { return eventDate; }
    public void setEventDate(String eventDate) { this.eventDate = eventDate; }

    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }

    public String getPoster() { return poster; }
    public void setPoster(String poster) { this.poster = poster; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public String getEcode() { return ecode; }
    public void setEcode(String ecode) { this.ecode = ecode; }

    public Integer getTeamSize() { return teamSize; }
    public void setTeamSize(Integer teamSize) { this.teamSize = teamSize; }
}
