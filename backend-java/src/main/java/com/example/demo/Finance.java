package com.example.demo;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.math.BigDecimal;

@Entity
@Table(name = "finances")
public class Finance {

    @EmbeddedId
    private FinanceId financeId;

    private String spentOn;
    private BigDecimal amount;

    @Lob
    private String receipt;

    public Finance() {}

    public Finance(FinanceId financeId, String spentOn, BigDecimal amount, String receipt) {
        this.financeId = financeId;
        this.spentOn = spentOn;
        this.amount = amount;
        this.receipt = receipt;
    }

    // Getters
    public FinanceId getFinanceId() {
        return financeId;
    }

    public String getSpentOn() {
        return spentOn;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getReceipt() {
        return receipt;
    }

    // Setters
    public void setFinanceId(FinanceId financeId) {
        this.financeId = financeId;
    }

    public void setSpentOn(String spentOn) {
        this.spentOn = spentOn;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public void setReceipt(String receipt) {
        this.receipt = receipt;
    }
}
