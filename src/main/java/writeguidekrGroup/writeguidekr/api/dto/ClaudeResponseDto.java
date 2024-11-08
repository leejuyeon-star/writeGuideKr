package writeguidekrGroup.writeguidekr.api.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data      // @ToString + @Getter + @Setter + @RequiredArgsConstructor + @EqualsAndHashCode
@NoArgsConstructor
public class ClaudeResponseDto {
    private String errorMessage = "";
    private List<String> answerList = new ArrayList<>();

    public void setAnswerList(String answer1, String answer2, String answer3) {
        answerList.add(answer1);
        answerList.add(answer2);
        answerList.add(answer3);
    }
}
