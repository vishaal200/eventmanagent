package com.example.eventmanagement.service;

import com.example.eventmanagement.dto.LoginRequest;
import com.example.eventmanagement.dto.RegisterRequest;
import com.example.eventmanagement.entity.User;
import com.example.eventmanagement.repository.UserRepository;


import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public boolean authenticate(String username, String rawPassword) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty())
            return false;

        User user = userOpt.get();
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }

    public String signup(RegisterRequest request) {
    if (userRepository.findByUsername(request.getUsername()).isPresent()) {
        return "Username already taken";
    }

    if (userRepository.findByEmail(request.getEmail()).isPresent()) {
        return "Email already registered";
    }

    User user = new User();
    user.setUsername(request.getUsername());
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setRole(request.getRole());
    userRepository.save(user);
    return "User registered successfully";
}


        // if (userRepository.findByUsername(username).isPresent()) {
        //     return "Username already taken";
        // }

        // User user = new User();
        // user.setUsername(username);
        // user.setEmail(email);
        // user.setRole(role);
        // user.setPassword(passwordEncoder.encode(rawPassword)); // hash the password

        // userRepository.save(user);
        // return "User registered successfully";
    

    public String login(LoginRequest request) {
        Optional<User> user = userRepository.findByEmail(request.getEmail());
        
        if(!user.isPresent()){
            return "User Not Present";
        }

        if (!passwordEncoder.matches(request.getPassword(), user.get().getPassword())) {
            // throw new RuntimeException("Invalid credentials");
            return "Invalid Credentials";
        }

        return "Login successful";
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by username
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + email));
    }
    // Update user
    public User updateUser(Long id, User updatedUser) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        existingUser.setUsername(updatedUser.getUsername());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        existingUser.setRole(updatedUser.getRole());

        return userRepository.save(existingUser);
    }

    // Update user
    public User forgotPass(User updatedUser) {
        Optional<User> existingUser = userRepository.findByEmail(updatedUser.getEmail());
        if(!existingUser.isPresent()){
            return null;
        }
        
        // existingUser.setUsername(updatedUser.getUsername());
        // existingUser.setEmail(updatedUser.getEmail());
        existingUser.get().setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        // existingUser.setRole(updatedUser.getRole());

        return userRepository.save(existingUser.get());
    }

    // Delete user
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

   

}
