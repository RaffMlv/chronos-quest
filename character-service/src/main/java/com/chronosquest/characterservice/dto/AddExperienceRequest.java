
package com.chronosquest.characterservice.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record AddExperienceRequest(
        @NotNull
        @Positive
        Long amount
) {
}
