package com.school.management.teacher;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Document(collection = "teachers")
public class Teacher {

    @Id
    private String id;

    @NotBlank(message = "Full name is required")
    private String fullname;

    @NotNull(message = "Age is required")
    @Min(value = 18, message = "Teacher must be at least 18 years old")
    private Integer age;

    @NotBlank(message = "Telephone is required")
    private String telephone;

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email address")
    private String email;

    public Teacher() {
    }

    public Teacher(String fullname, Integer age, String telephone, String email) {
        this.fullname = fullname;
        this.age = age;
        this.telephone = telephone;
        this.email = email;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}