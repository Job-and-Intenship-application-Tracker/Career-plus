package com.careerplus.controller;

import com.careerplus.model.User;
import com.careerplus.repository.UserRepository;
import com.careerplus.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private UserRepository userRepository;

    private Long getUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() != null) {
            String email = auth.getPrincipal().toString();
            User user = userRepository.findByEmail(email).orElse(null);
            if (user != null) return user.getId();
        }
        return 1L; // Fallback
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        Map<String, Object> analytics = analyticsService.getAnalytics(getUserId());
        return ResponseEntity.ok(analytics);
    }
}
