
package com.school.management.student;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(String id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Student not found"));
    }

    public Student createStudent(Student student) {
        student.setId(null);
        return studentRepository.save(student);
    }

    public Student updateStudent(String id, Student updatedStudent) {
        Student existingStudent = getStudentById(id);

        existingStudent.setFullname(updatedStudent.getFullname());
        existingStudent.setAge(updatedStudent.getAge());
        existingStudent.setClassName(updatedStudent.getClassName());

        return studentRepository.save(existingStudent);
    }

    public void deleteStudent(String id) {
        if (!studentRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Student not found");
        }

        studentRepository.deleteById(id);
    }
}
