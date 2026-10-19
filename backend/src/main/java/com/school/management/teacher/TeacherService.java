package com.school.management.teacher;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TeacherService {

    private final TeacherRepository teacherRepository;

    public TeacherService(TeacherRepository teacherRepository) {
        this.teacherRepository = teacherRepository;
    }

    // Get all teachers
    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    // Get one teacher by ID
    public Teacher getTeacherById(String id) {
        return teacherRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Teacher not found"));
    }

    // Create a teacher
    public Teacher createTeacher(Teacher teacher) {
        teacher.setId(null);
        return teacherRepository.save(teacher);
    }

    // Update a teacher
    public Teacher updateTeacher(String id, Teacher updatedTeacher) {
        Teacher existingTeacher = getTeacherById(id);

        existingTeacher.setFullname(updatedTeacher.getFullname());
        existingTeacher.setAge(updatedTeacher.getAge());
        existingTeacher.setTelephone(updatedTeacher.getTelephone());
        existingTeacher.setEmail(updatedTeacher.getEmail());

        return teacherRepository.save(existingTeacher);
    }

    // Delete a teacher
    public void deleteTeacher(String id) {
        Teacher teacher = getTeacherById(id);
        teacherRepository.delete(teacher);
    }
}