package com.example.eventmanagement.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

@Entity
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String message;
    private LocalDateTime createdAt;
    private boolean isRead = false;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;  

    public Notification() {
        this.createdAt = LocalDateTime.now();
    }

    public Notification(String title, String message, User user) {
        this.title = title;
        this.message = message;
        this.user = user;
        this.createdAt = LocalDateTime.now();
    }
}
