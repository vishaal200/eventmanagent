package com.example.eventmanagement.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.eventmanagement.dto.EventRequest;
import com.example.eventmanagement.entity.Event;
import com.example.eventmanagement.entity.Notification;
import com.example.eventmanagement.entity.User;
import com.example.eventmanagement.repository.EventRepository;
import com.example.eventmanagement.repository.NotificationRepository;
import com.example.eventmanagement.repository.UserRepository;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository profileRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    // public Event createEvent(Long organiserId, Event event) {
    //     User organiser = profileRepository.findById(organiserId)
    //         .orElseThrow(() -> new RuntimeException("Organiser not found"));

    //     event.setOrganiser(organiser);
    //     return eventRepository.save(event);
    // }

    public Event createEvent(EventRequest request) {
    User organiser = profileRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> new RuntimeException("Organiser not found"));

    Event event = new Event();
    event.setTitle(request.getTitle());
    event.setDescription(request.getDescription());
    event.setLocation(request.getLocation());
    event.setStartTime(request.getStartTime());
    event.setEndTime(request.getEndTime());
    event.setDate(request.getDate());
    event.setCapacity(request.getCapacity());
    event.setOrganiser(organiser);

    Event savedEvent = eventRepository.save(event);

    // 🔁 Create a notification for each participant
    String message = "There is a new event '" + event.getTitle() + ". Check it out!";
    List<User> participants = profileRepository.findByRole("participant");

    for (User participant : participants) {
        Notification notification = new Notification(event.getTitle(), message, participant);
        notificationRepository.save(notification);
    }

    return savedEvent;
}



    public Event updateEvent(Long eventId, Event updatedEvent) {
        Event existing = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));

        existing.setTitle(updatedEvent.getTitle());
        existing.setDescription(updatedEvent.getDescription());
        existing.setLocation(updatedEvent.getLocation());
        existing.setDate(updatedEvent.getDate());
        existing.setStartTime(updatedEvent.getStartTime());
        existing.setEndTime(updatedEvent.getEndTime());
        existing.setCapacity(updatedEvent.getCapacity());

        return eventRepository.save(existing);
    }

    public void deleteEvent(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new RuntimeException("Event not found");
        }
        eventRepository.deleteById(eventId);
    }

    public List<Event> getEventsByOrganiser(Long organiserId) {
        return eventRepository.findByOrganiserId(organiserId);
    }

   public List<Event> fetchEvents(String email) {
    User user = profileRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User not found"));
    return eventRepository.findByOrganiserId(user.getId());
}


    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }
}


