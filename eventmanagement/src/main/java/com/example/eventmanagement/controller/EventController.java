package com.example.eventmanagement.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.eventmanagement.dto.EventRequest;
import com.example.eventmanagement.service.EventService;
import com.example.eventmanagement.entity.*;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:5173")
public class EventController {

    @Autowired
    private EventService eventService;

    // @PostMapping("/organiser/{organiserId}")
    // public ResponseEntity<Event> createEvent(@PathVariable Long organiserId,
    // @RequestBody Event event) {
    // return ResponseEntity.ok(eventService.createEvent(organiserId, event));
    // }

    @PostMapping("/organiser")
    public ResponseEntity<Event> createEvent(@RequestBody EventRequest eventRequest) {
        return ResponseEntity.ok(eventService.createEvent(eventRequest));
    }

    @PutMapping("/{eventId}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long eventId, @RequestBody Event updatedEvent) {
        return ResponseEntity.ok(eventService.updateEvent(eventId, updatedEvent));
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId) {
        eventService.deleteEvent(eventId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/organiser/{organiserId}")
    public ResponseEntity<List<Event>> getEvents(@PathVariable Long organiserId) {
        return ResponseEntity.ok(eventService.getEventsByOrganiser(organiserId));
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<Optional<Event>> getEventsId(@PathVariable Long eventId){
        return ResponseEntity.ok(eventService.getEventById(eventId));
    }

    @GetMapping("/myevents")
    public ResponseEntity<List<Event>> fetchEvents(@RequestParam String email) {
        return ResponseEntity.ok(eventService.fetchEvents(email));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

}