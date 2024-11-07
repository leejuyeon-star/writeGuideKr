package writeguidekrGroup.writeguidekr.api.dto;

import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Builder
@Data      // @ToString + @Getter + @Setter + @RequiredArgsConstructor + @EqualsAndHashCode
public class ClaudeRequestApiDto {
    private String model;
    private List<Message> messages;
    private int max_tokens;
    private List<String> stop_sequences;
    private String system;

    @Data
    @Builder
    public static class Message {
        private String role;
        private String content;
    }

    public void setMessages (List<Message> messages) {
        this.messages = messages;
    }

    public void setMessages(String userContent, String assistantContent) {
        this.messages = new ArrayList<>();
        this.messages.add(new Message("user", userContent));
        this.messages.add(new Message("assistant", assistantContent));
    }
}

