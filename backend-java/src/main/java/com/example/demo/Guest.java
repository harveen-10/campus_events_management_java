package com.example.demo;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "guests")
public class Guest {

    @EmbeddedId
    private GuestId guestId;

    @Column(name = "Name", length = 255)
    private String name;

    @Column(name = "Email", length = 255)
    private String email;

    @Column(name = "Role", length = 255)
    private String role;

    @Column(name = "phone_no", length = 255)
    private String phone_no;

    public Guest() {}

    public Guest(GuestId guestId, String name, String email, String role, String phone_no) {
        this.guestId = guestId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.phone_no = phone_no;
    }

    public GuestId getGuestId() {return guestId;}
    public void setGuestId(GuestId guestId) { this.guestId = guestId; }

    public String getName() {return name;}
    public void setName(String name) { this.name = name; }

    public String getEmail() {return email;}
    public void setEmail(String email) { this.email = email; }

    public String getRole() {return role;}
    public void setRole(String role) { this.role = role; }

    public String getPhone_no() {return phone_no;}
    public void setPhone_no(String phone_no) { this.phone_no = phone_no; }
}
