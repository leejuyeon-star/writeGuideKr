package writeguidekrGroup.writeguidekr.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data      // @ToString + @Getter + @Setter + @RequiredArgsConstructor + @EqualsAndHashCode
@NoArgsConstructor
public class ClaudeRequestDto {
    private String targetWord;
    private String targetSentence;
    private String targetBeforeWord;
}
