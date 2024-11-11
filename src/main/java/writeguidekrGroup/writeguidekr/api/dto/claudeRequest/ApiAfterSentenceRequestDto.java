package writeguidekrGroup.writeguidekr.api.dto.claudeRequest;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data      // @ToString + @Getter + @Setter + @RequiredArgsConstructor + @EqualsAndHashCode
@NoArgsConstructor
public class ApiAfterSentenceRequestDto {
    private String targetSentence;
}
