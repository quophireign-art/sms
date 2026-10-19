package com.school.management.teacher;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    private final TeacherService teacherService;

    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    // Get all teachers
    @GetMapping
    public List<Teacher> getAllTeachers() {
        return teacherService.getAllTeachers();
    }

    // Get one teacher by ID
    @GetMapping("/{id}")
    public Teacher getTeacherById(@PathVariable String id) {
        return teacherService.getTeacherById(id);
    }

    // Create a teacher
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Teacher createTeacher(@Valid @RequestBody Teacher teacher) {
        return teacherService.createTeacher(teacher);
    }

    // Update a teacher
    @PutMapping("/{id}")
    public Teacher updateTeacher(
            @PathVariable String id,
            @Valid @RequestBody Teacher teacher) {
        return teacherService.updateTeacher(id, teacher);
    }

    // Delete a teacher
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTeacher(@PathVariable String id) {
        teacherService.deleteTeacher(id);
    }
}