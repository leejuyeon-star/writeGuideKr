package writeguidekrGroup.writeguidekr.controller.dto.claude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data      // @ToString + @Getter + @Setter + @RequiredArgsConstructor + @EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class ClaudeResponseDto {
    private String errorMessage = "";

    private Message<String> message;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Message<String> {
        private String fir;         //첫번째 문장
        private String sec;         //두번째 문장
        private String thir;        //세번째 문장
    }




}
