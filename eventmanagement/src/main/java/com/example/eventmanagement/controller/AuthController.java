package com.example.eventmanagement.controller;

import com.example.eventmanagement.dto.LoginRequest;
import com.example.eventmanagement.dto.RegisterRequest;
import com.example.eventmanagement.service.AuthService;
import com.example.eventmanagement.entity.*;
import java.util.*;
// import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody RegisterRequest request) {
        String result = authService.signup(request);
        // return ResponseEntity.ok(response);
        // String result = authService.register(
        //         registerRequest.getUsername(),
        //         registerRequest.getEmail(),
        //         registerRequest.getPassword(),
        //         registerRequest.getRole());

        if (result.equals("User registered successfully")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
    }

   // AuthController.java

@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    String response = authService.login(request);

    switch (response) {
        case "User Not Present":
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        case "Invalid Credentials":
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        default:
            if (response.startsWith("No ")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }
            // Login success → return email & role
            Map<String, String> result = new HashMap<>();
            result.put("email", request.getEmail());
            return ResponseEntity.ok(result);
    }
}


    @PutMapping("/forgot")
    public ResponseEntity<?> forgotPass(@RequestBody User updatedUser) {
        User user = authService.forgotPass(updatedUser);
        if(user == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                             .body("Email not found.");
        }
        return ResponseEntity.ok(user);
    }

    @GetMapping
    public List<User> getAllUsers() {
        List<User> user = authService.getAllUsers();
        if(user.isEmpty()){
            return new ArrayList<>();
        }
        return authService.getAllUsers();
    }

    // Get user by username
    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        User user = authService.getUserByUsername(username);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        User user = authService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    // Update user
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        User user = authService.updateUser(id, updatedUser);
        return ResponseEntity.ok(user);
    }

    // Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        authService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully.");
    }
}
