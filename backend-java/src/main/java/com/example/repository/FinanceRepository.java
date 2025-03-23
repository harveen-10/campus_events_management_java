package com.example.repository;

import com.example.demo.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

public interface FinanceRepository extends JpaRepository<Finance, FinanceId> {
    Optional<Finance> findByFinanceId_TransID(String transID);
    
    Optional<Finance> findByFinanceId_TransIDAndFinanceId_EventID(String transID, String eventID);

    // Delete finance details by TransID
    void deleteByFinanceId_TransIDAndFinanceId_EventID(String transID, String eventID);
}