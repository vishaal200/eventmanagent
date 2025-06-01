package com.example.eventmanagement.repository;

import com.example.eventmanagement.entity.Registration;
import com.example.eventmanagement.entity.Event;
import com.example.eventmanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByEvent(Event event);

    Optional<Registration> findByUserAndEvent(User user, Event event);

    
    List<Registration> findByUser(User user);


}
