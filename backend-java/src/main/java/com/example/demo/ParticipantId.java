package com.example.demo;

import java.io.Serializable;
import java.util.Objects;

public class ParticipantId implements Serializable {

    private String srn;
    private String eventID;

    public ParticipantId() {}

    public ParticipantId(String srn, String eventID) {
        this.srn = srn;
        this.eventID = eventID;
    }

    public String getEventID() {
        return eventID;
    }
    public String getSrn() {
        return srn;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ParticipantId that = (ParticipantId) o;
        return Objects.equals(srn, that.srn) && Objects.equals(eventID, that.eventID);
    }

    @Override
    public int hashCode() {
        return Objects.hash(srn, eventID);
    }
}
