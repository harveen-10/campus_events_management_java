package com.example.demo;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Keep only strategy, remove name attribute
    @Column(name = "user_id") // Map the column to "user_id"
    private Long userId;

    @Column(name="srn", nullable = false, unique = true, length = 20)
    private String srn;

    @Column(name="email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name="name", nullable = false, length = 100)
    private String name;

    @Column(name="password", nullable = false, length = 255)
    private String password;

    // Constructors
    public User() {}

    public User(String srn, String email, String name, String password) {
        this.srn = srn;
        this.email = email;
        this.name = name;
        this.password = password;
    }

    // Getters & Setters
    public Long getUserId() {
        return userId;
    }

    public String getSrn() {
        return srn;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getPassword() {
        return password;
    }

    public void setSrn(String srn) {
        this.srn = srn;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
