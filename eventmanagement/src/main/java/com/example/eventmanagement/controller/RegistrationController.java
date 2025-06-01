package com.example.eventmanagement.controller;

import com.example.eventmanagement.dto.RegistrationRequest;
import com.example.eventmanagement.dto.UserDTO;
import com.example.eventmanagement.entity.Event;
import com.example.eventmanagement.entity.Registration;
import com.example.eventmanagement.service.RegistrationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@CrossOrigin(origins = "http://localhost:5173")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping("/register")
    public ResponseEntity<Registration> registerUserToEvent(
            @RequestBody RegistrationRequest request) {
        Registration registration = registrationService.registerUserToEvent(
                request.getUserId(), request.getEventId());
        return ResponseEntity.ok(registration);
    }

    // @GetMapping("/event/{eventId}")
    // public ResponseEntity<List<Registration>>
    // getRegistrationsForEvent(@PathVariable Long eventId) {
    // return
    // ResponseEntity.ok(registrationService.getRegistrationsForEvent(eventId));
    // }

    @GetMapping("/all")
    public ResponseEntity<List<Registration>> getAllRegistrations() {
        return ResponseEntity.ok(registrationService.getAllRegistrations());
    }

    @DeleteMapping("/{registrationId}")
    public ResponseEntity<String> deleteRegistrationById(@PathVariable Long registrationId) {
        registrationService.deleteRegistrationById(registrationId);
        return ResponseEntity.ok("Registration deleted successfully.");
    }

    @DeleteMapping
    public ResponseEntity<String> deleteRegistration(@RequestBody RegistrationRequest request) {
        registrationService.deleteRegistration(request.getUserId(), request.getEventId());
        return ResponseEntity.ok("Registration deleted successfully.");
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Event>> getEventsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(registrationService.getEventsByUserId(userId));
    }

    @GetMapping("/event/{eventId}")
public ResponseEntity<List<UserDTO>> getUsersByEventId(@PathVariable Long eventId) {
    return ResponseEntity.ok(registrationService.getUsersByEventId(eventId));
}

}
