package com.careerplus.app.controller;

import com.careerplus.app.model.Application;
import com.careerplus.app.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @GetMapping
    public ResponseEntity<List<Application>> getAllApplications() {
        List<Application> apps = applicationRepository.findAll();
        return ResponseEntity.ok(apps);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Application> getApplicationById(@PathVariable Long id) {
        Optional<Application> app = applicationRepository.findById(id);
        return app.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Application> createApplication(@RequestBody Application application) {
        if (application.getStatus() == null) application.setStatus("applied");
        Application saved = applicationRepository.save(application);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Application> updateApplication(@PathVariable Long id, @RequestBody Application updatedApp) {
        Optional<Application> existingOpt = applicationRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Application app = existingOpt.get();
        if (updatedApp.getJobTitle() != null) app.setJobTitle(updatedApp.getJobTitle());
        if (updatedApp.getCompanyName() != null) app.setCompanyName(updatedApp.getCompanyName());
        if (updatedApp.getStatus() != null) app.setStatus(updatedApp.getStatus());
        if (updatedApp.getOfferedSalary() != null) app.setOfferedSalary(updatedApp.getOfferedSalary());
        if (updatedApp.getNotes() != null) app.setNotes(updatedApp.getNotes());
        if (updatedApp.getInterviewRound() != null) app.setInterviewRound(updatedApp.getInterviewRound());
        if (updatedApp.getResumeName() != null) app.setResumeName(updatedApp.getResumeName());
        if (updatedApp.getRecruiterName() != null) app.setRecruiterName(updatedApp.getRecruiterName());
        if (updatedApp.getRecruiterEmail() != null) app.setRecruiterEmail(updatedApp.getRecruiterEmail());

        Application saved = applicationRepository.save(app);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        if (!applicationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        applicationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
