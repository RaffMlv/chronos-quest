
package com.chronosquest.characterservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class CreateCharacterRequest {

    @NotBlank(message = "O nome do personagem é obrigatório.")
    @Size(min = 3, max = 60,
            message = "O nome deve ter entre 3 e 60 caracteres.")
    private String name;

    @NotNull(message = "A classe do personagem é obrigatória.")
    @Positive(message = "O ID da classe deve ser positivo.")
    private Long classId;

    public CreateCharacterRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getClassId() {
        return classId;
    }

    public void setClassId(Long classId) {
        this.classId = classId;
    }
}
