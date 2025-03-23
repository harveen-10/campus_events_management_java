package com.example.demo;

import java.io.Serializable;
import java.util.Objects;

public class FinanceId implements Serializable {
    private String transID;
    private String eventID;

    public FinanceId() {}

    public FinanceId(String transID, String eventID) {
        this.transID = transID;
        this.eventID = eventID;
    }
    
    public String getEventID() {
        return eventID;
    }

    public String getTransID() { 
        return transID;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FinanceId that = (FinanceId) o;
        return Objects.equals(transID, that.transID) && Objects.equals(eventID, that.eventID);
    }

    @Override
    public int hashCode() {
        return Objects.hash(transID, eventID);
    }
}
