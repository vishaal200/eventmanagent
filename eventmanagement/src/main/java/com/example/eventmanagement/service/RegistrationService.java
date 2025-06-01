package com.example.eventmanagement.service;

import com.example.eventmanagement.entity.Registration;
import com.example.eventmanagement.entity.User;
import com.example.eventmanagement.dto.UserDTO;
import com.example.eventmanagement.entity.Event;
import com.example.eventmanagement.repository.EventRepository;
import com.example.eventmanagement.repository.UserRepository;
import com.example.eventmanagement.repository.RegistrationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    public RegistrationService(RegistrationRepository registrationRepository,
            UserRepository userRepository,
            EventRepository eventRepository) {
        this.registrationRepository = registrationRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
    }

    public Registration registerUserToEvent(Long userId, Long eventId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));

        if (registrationRepository.findByUserAndEvent(user, event).isPresent()) {
            throw new RuntimeException("User already registered for this event");
        }

        Registration registration = new Registration();
        registration.setUser(user);
        registration.setEvent(event);

        return registrationRepository.save(registration);
    }

    // public List<Registration> getRegistrationsForEvent(Long eventId) {
    //     Event event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));
    //     return registrationRepository.findByEvent(event);
    // }

    public List<Registration> getAllRegistrations() {
        return registrationRepository.findAll();
    }

    public void deleteRegistrationById(Long registrationId) {
        if (!registrationRepository.existsById(registrationId)) {
            throw new RuntimeException("Registration not found with ID: " + registrationId);
        }
        registrationRepository.deleteById(registrationId);
    }

    public void deleteRegistration(Long userId, Long eventId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        Registration registration = registrationRepository.findByUserAndEvent(user, event)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        registrationRepository.delete(registration);
    }

public List<Event> getEventsByUserId(Long userId) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    List<Registration> registrations = registrationRepository.findByUser(user);

    // Extract and return the event from each registration
    return registrations.stream()
            .map(Registration::getEvent)
            .toList();
}

public List<UserDTO> getUsersByEventId(Long eventId) {
    Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));

    List<Registration> registrations = registrationRepository.findByEvent(event);

    return registrations.stream()
            .map(reg -> new UserDTO(reg.getUser().getUsername(), reg.getUser().getEmail()))
            .collect(Collectors.toList());
}
}
