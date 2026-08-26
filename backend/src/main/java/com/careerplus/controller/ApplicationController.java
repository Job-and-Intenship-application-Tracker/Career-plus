package com.careerplus.controller;

import com.careerplus.dto.ApplicationRequest;
import com.careerplus.model.Application;
import com.careerplus.model.Note;
import com.careerplus.model.User;
import com.careerplus.repository.ApplicationRepository;
import com.careerplus.repository.NoteRepository;
import com.careerplus.repository.UserRepository;
import com.careerplus.service.PriorityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private PriorityService priorityService;

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() != null) {
            String email = auth.getPrincipal().toString();
            return userRepository.findByEmail(email).orElse(null);
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<List<Application>> getAllApplications() {
        User user = getAuthenticatedUser();
        Long userId = user != null ? user.getId() : 1L;

        List<Application> apps = applicationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        apps.forEach(priorityService::calculateAndAssignPriority);

        return ResponseEntity.ok(apps);
    }

    @PostMapping
    public ResponseEntity<Application> createApplication(@Valid @RequestBody ApplicationRequest request) {
        User user = getAuthenticatedUser();
        if (user == null) {
            user = userRepository.findAll().stream().findFirst().orElse(null);
        }

        Application app = new Application();
        app.setUser(user);
        app.setCompanyName(request.getCompanyName());
        app.setCompanyWebsite(request.getCompanyWebsite());
        app.setJobTitle(request.getJobTitle());
        app.setApplicationType(request.getApplicationType() != null ? request.getApplicationType() : "Full-time");
        app.setLocation(request.getLocation());
        app.setWorkMode(request.getWorkMode() != null ? request.getWorkMode() : "Remote");
        app.setAppliedDate(request.getAppliedDate() != null ? request.getAppliedDate() : LocalDate.now());
        app.setStatus(request.getStatus() != null ? request.getStatus().trim().toLowerCase() : "applied");
        app.setApplicationSource(request.getApplicationSource() != null ? request.getApplicationSource() : "LinkedIn");
        app.setRecruiterName(request.getRecruiterName());
        app.setRecruiterEmail(request.getRecruiterEmail());
        app.setRecruiterPhone(request.getRecruiterPhone());
        app.setOfferedSalary(request.getOfferedSalary());
        app.setInterviewDate(request.getInterviewDate());
        app.setInterviewTime(request.getInterviewTime());
        app.setInterviewRound(request.getInterviewRound());
        app.setInterviewType(request.getInterviewType());
        app.setSkillsRequired(request.getSkillsRequired());
        app.setNotes(request.getNotes());
        app.setFollowUpDate(request.getFollowUpDate());
        app.setResumeName(request.getResumeName());

        priorityService.calculateAndAssignPriority(app);
        Application saved = applicationRepository.save(app);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Application> updateApplication(@PathVariable Long id, @RequestBody ApplicationRequest request) {
        Optional<Application> optionalApp = applicationRepository.findById(id);
        if (optionalApp.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Application app = optionalApp.get();
        if (request.getCompanyName() != null) app.setCompanyName(request.getCompanyName());
        if (request.getCompanyWebsite() != null) app.setCompanyWebsite(request.getCompanyWebsite());
        if (request.getJobTitle() != null) app.setJobTitle(request.getJobTitle());
        if (request.getApplicationType() != null) app.setApplicationType(request.getApplicationType());
        if (request.getLocation() != null) app.setLocation(request.getLocation());
        if (request.getWorkMode() != null) app.setWorkMode(request.getWorkMode());
        if (request.getAppliedDate() != null) app.setAppliedDate(request.getAppliedDate());
        if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) {
            app.setStatus(request.getStatus().trim().toLowerCase());
        }
        if (request.getApplicationSource() != null) app.setApplicationSource(request.getApplicationSource());
        if (request.getRecruiterName() != null) app.setRecruiterName(request.getRecruiterName());
        if (request.getRecruiterEmail() != null) app.setRecruiterEmail(request.getRecruiterEmail());
        if (request.getRecruiterPhone() != null) app.setRecruiterPhone(request.getRecruiterPhone());
        if (request.getOfferedSalary() != null) app.setOfferedSalary(request.getOfferedSalary());
        if (request.getInterviewDate() != null) app.setInterviewDate(request.getInterviewDate());
        if (request.getInterviewTime() != null) app.setInterviewTime(request.getInterviewTime());
        if (request.getInterviewRound() != null) app.setInterviewRound(request.getInterviewRound());
        if (request.getInterviewType() != null) app.setInterviewType(request.getInterviewType());
        if (request.getSkillsRequired() != null) app.setSkillsRequired(request.getSkillsRequired());
        if (request.getNotes() != null) app.setNotes(request.getNotes());
        if (request.getFollowUpDate() != null) app.setFollowUpDate(request.getFollowUpDate());
        if (request.getResumeName() != null) app.setResumeName(request.getResumeName());

        priorityService.calculateAndAssignPriority(app);
        Application updated = applicationRepository.save(app);

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteApplication(@PathVariable Long id) {
        if (!applicationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        applicationRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Application deleted successfully."));
    }

    @GetMapping("/{id}/notes")
    public ResponseEntity<List<Note>> getNotes(@PathVariable Long id) {
        List<Note> notes = noteRepository.findByApplicationIdOrderByCreatedAtDesc(id);
        return ResponseEntity.ok(notes);
    }

    @PostMapping("/{id}/notes")
    public ResponseEntity<Note> addNote(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<Application> optionalApp = applicationRepository.findById(id);
        if (optionalApp.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        String noteText = body.get("noteText");
        User user = getAuthenticatedUser();
        Long userId = user != null ? user.getId() : 1L;

        Note note = new Note(optionalApp.get(), userId, noteText);
        Note savedNote = noteRepository.save(note);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedNote);
    }
}
