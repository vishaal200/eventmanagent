package com.example.eventmanagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;


import com.example.eventmanagement.entity.Notification;
import com.example.eventmanagement.entity.User;



public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findAllByOrderByCreatedAtDesc();
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
}


