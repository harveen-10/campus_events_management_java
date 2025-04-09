package com.example.demo;

import jakarta.persistence.*;

@Entity
@Table(name = "organizers")
public class Organizer {

    @Id
    @Column(name = "SRN")
    private String srn;

    @Column(name = "Name")
    private String name;

    @Column(name = "Email")
    private String email;

    @Column(name = "phone_no")
    private String phoneNo;

    // Constructors
    public Organizer() {
    }

    public Organizer(String srn, String name, String email, String phoneNo) {
        this.srn = srn;
        this.name = name;
        this.email = email;
        this.phoneNo = phoneNo;
    }

    // Getters and Setters
    public String getSrn() {return srn;}
    public void setSrn(String srn) {this.srn = srn;}

    public String getName() {return name;}
    public void setName(String name) {this.name = name;}

    public String getEmail() {return email;}
    public void setEmail(String email) {this.email = email;}

    public String getPhoneNo() {return phoneNo;}
    public void setPhoneNo(String phoneNo) {this.phoneNo = phoneNo;}
}

