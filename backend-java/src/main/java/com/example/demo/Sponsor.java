package com.example.demo;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "sponsors")
public class Sponsor {

    @EmbeddedId
    private SponsorId id;  // Composite Key (ID + EventID)

    @Column(name = "Name", length = 100, nullable = false)
    private String name;

    @Column(name = "Email", length = 100, nullable = false)
    private String email;

    @Column(name = "Contribution", precision = 10)
    private Double contribution;

    @Column(name = "phone_no", length = 10)
    private String phoneNo;

    // Constructors
    public Sponsor() {}

    public Sponsor(SponsorId id, String name, String email, Double contribution, String phoneNo) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.contribution = contribution;
        this.phoneNo = phoneNo;
    }

    // Getters and Setters
    public SponsorId getId() { return id; }
    public void setId(SponsorId id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Double getContribution() { return contribution; }
    public void setContribution(Double contribution) { this.contribution = contribution; }

    public String getPhoneNo() { return phoneNo; }
    public void setPhoneNo(String phoneNo) { this.phoneNo = phoneNo; }
}
