package com.example.demo;

import java.io.Serializable;
import java.util.Objects;

public class GuestId implements Serializable {
    private String ID;
    private String EventID;

    public GuestId() {}

    public GuestId(String ID, String EventID) {
        this.ID = ID;
        this.EventID = EventID;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GuestId guestId = (GuestId) o;
        return Objects.equals(ID, guestId.ID) && Objects.equals(EventID, guestId.EventID);
    }

    @Override
    public int hashCode() {
        return Objects.hash(ID, EventID);
    }
}