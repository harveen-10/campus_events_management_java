package com.example.demo;

import jakarta.persistence.*;
import java.util.Objects;

public class ParticipantDTO {
    private String srn;
    private String name;
    private String email;
    @Column(name = "\"phone_no\"", length = 10) 
    private String phoneNo;

    // Getters and Setters
    public String getSrn() { return srn; }
    public void setSrn(String srn) { this.srn = srn; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNo() { return phoneNo; }
    public void setPhoneNo(String phoneNo) { this.phoneNo = phoneNo; }
}
