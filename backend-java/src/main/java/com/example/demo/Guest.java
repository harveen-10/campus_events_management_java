package com.example.demo;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "guests")
public class Guest {

    @EmbeddedId
    @JsonIgnore  // Prevents serialization issue
    private GuestId guestId;

    private String Name;
    private String Email;
    private String Role;
    private String phone_no;

    public Guest() {}

    public Guest(GuestId guestId, String Name, String Email, String Role, String phone_no) {
        this.guestId = guestId;
        this.Name = Name;
        this.Email = Email;
        this.Role = Role;
        this.phone_no = phone_no;
    }

    public GuestId getGuestId() {
        return guestId;
    }

    public String getName() {
        return Name;
    }

    public String getEmail() {
        return Email;
    }

    public String getRole() {
        return Role;
    }

    public String getPhone_no() {
        return phone_no;
    }
}
