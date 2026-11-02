package com.chronosquest.characterservice.dto;

import java.time.LocalDateTime;

public class CharacterResponse {

    private Long id;
    private String name;
    private Long classId;
    private String className;
    private LocalDateTime createdAt;
    private CharacterSheetResponse sheet;

    public CharacterResponse() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getClassId() { return classId; }
    public void setClassId(Long classId) { this.classId = classId; }

    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public CharacterSheetResponse getSheet() { return sheet; }
    public void setSheet(CharacterSheetResponse sheet) { this.sheet = sheet; }
}
