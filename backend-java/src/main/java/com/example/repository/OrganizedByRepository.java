package com.example.repository;

import com.example.demo.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizedByRepository extends JpaRepository<OrganizedBy, OrganizedById> {
    boolean existsById(OrganizedById id);

    void deleteById_Srn(String srn);
}
