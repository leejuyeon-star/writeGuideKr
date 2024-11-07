package writeguidekrGroup.writeguidekr.api.dto;

import lombok.*;
import java.util.List;

@Data   // @ToString + @Getter + @Setter + @RequiredArgsConstructor + @EqualsAndHashCode
public class ClaudeResponseApiDto {
    private List<Content> content; //content[0].text content[0].type이렇게 찾아야 함
    private String id;          // 고유아이디 or null
    private String model;       // 모델명 or null
    private String role;        // "assistant" or null
    private String stop_reason;     // (답변문장이 중간에 끊긴 경우 그 이유) ["end_turn"(응답완료) / "max_tokens"(최대 토큰 수에 도달) / "stop_sequence"(stop_sequence 발현)] or null
    private String stop_sequence;   // [null / request에서 설정했던 stop_sequence값 ] or null
    private String type;        // "message" or "error"
    private Usage usage;       //  Content or null

    public static ClaudeResponseApiDto getClaudeErrorDto(String errorMessage) {
        ClaudeResponseApiDto claudeResponseApiDto = new ClaudeResponseApiDto();
        Content content = new Content();
        content.setText(errorMessage);
        claudeResponseApiDto.setType("error");
        claudeResponseApiDto.setContent(List.of(content));
        return claudeResponseApiDto;
    }

    @Data
    public static class Content {
        public String text;     // 답변  or null
        public String type;     // "text" or error 상세 정보
    }

    @Data
    public static class Usage {
        public int input_tokens;    //input 토큰 수
        public int output_tokens;   //output 토큰 수
    }
}

//@Data
//public class Content {
//    public String text;     // 답변  or null
//    public String type;     // "text" or error 상세 정보
//}

//@Data
//public class Usage {
//    public int input_tokens;    //input 토큰 수
//    public int output_tokens;   //output 토큰 수
//}

//정상 대답할때
//{
//        "content": [
//        {
//        "text": "Hi! My name is Claude.",
//        "type": "text"
//        }
//        ],
//        "id": "msg_013Zva2CMHLNnXjNJJKqJ2EF",
//        "model": "claude-3-5-sonnet-20241022",
//        "role": "assistant",
//        "stop_reason": "end_turn",
//        "stop_sequence": null,
//        "type": "message",
//        "usage": {
//        "input_tokens": 2095,
//        "output_tokens": 503
//        }
//        }
//

// 에러 답변일때
//        {
//        "type": "error",
//        "error": {
//        "type": "invalid_request_error",
//        "message": "<string>"
//        }

//내가 만든 에러


        