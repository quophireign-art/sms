
package com.school.management.student;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface StudentRepository
        extends MongoRepository<Student, String> {
}
