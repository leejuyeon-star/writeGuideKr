package writeguidekrGroup.writeguidekr.api;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import writeguidekrGroup.writeguidekr.api.dto.ClaudeRequestApiDto;
import writeguidekrGroup.writeguidekr.api.dto.ClaudeResponseApiDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import writeguidekrGroup.writeguidekr.domain.dto.claude.ClaudeResponseDto;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClaudeServiceImpl implements ClaudeService {
    private final ClaudeConfig claudeConfig;

    private String modelVersion = "claude-3-haiku-20240307";
    private int maxTokens = 1000;


    @Override
    public Mono<ClaudeResponseDto> sendApiRequestWithJson(String system, String prompt) {
        System.out.println("sendApiRequestWithJson");
        ArrayList<String> stopSequences = new ArrayList<>();
        stopSequences.add("}");                             //마지막에 json 형식이 아닌 다른 서론은 안나오도록 하기

        ClaudeRequestApiDto request = ClaudeRequestApiDto.builder()
                .model(modelVersion)
                .system(system)
                .stop_sequences(stopSequences)
                .max_tokens(maxTokens)
                .build();

        request.setMessages(prompt, "{");       //처음에 json 형식이 아닌 다른 서론은 안나오도록 하기

        System.out.println("request");
        System.out.println(request);

        return claudeConfig.getWebClient().post()
                .bodyValue(request)
                .retrieve()
//                .onStatus(status -> status.is4xxClientError(), clientResponse -> Mono.just(new ClaudeClientException(clientResponse)))
//                .onStatus(status -> status.is5xxServerError(), clientResponse -> Mono.just(new ClaudeServerException()))
                .bodyToMono(ClaudeResponseApiDto.class)
                .map(data -> {
                    //데이터 형변환
                    System.out.println("mapping");
                    return formatIntoResponseDto(false, data);
                })
                .onErrorResume(error -> {
                    System.out.println("Claude Api Error: "+ error.getMessage());
                    return Mono.just(formatIntoResponseDto(true, null));
//                    return Mono.just(ClaudeResponseDto.getClaudeErrorDto(error.getMessage()));
                });
    }

    @Override
    public ClaudeResponseDto formatIntoResponseDto(boolean isNetworkError, ClaudeResponseApiDto claudeResponseApiDto)  {
        System.out.println("claudeResponseApiDto");
        System.out.println(claudeResponseApiDto);
        ClaudeResponseDto claudeResponseDto = new ClaudeResponseDto();
        if (isNetworkError) {
            claudeResponseDto.setErrorMessage("ai api 오류");
            return claudeResponseDto;
        }
        // JSON 문자열을 Java 객체로 변환할 ObjectMapper 생성
        ObjectMapper objectMapper = new ObjectMapper();

//        if (claudeResponseApiDto.getType().equals("message")) {  //api 정상 작동시
            String message = claudeResponseApiDto.getContent().get(0).getText();
            System.out.println("message");
            System.out.println(message);
            if (message.charAt(0) != '{') {
                message = '{'+message;
            }
            if ((message.charAt(message.length()-1)) != '}') {
                message = message + '}';
            }
            String jsonMessage = message;
            System.out.println("jsonMessage");
            System.out.println(jsonMessage);
            try {
                ClaudeResponseDto.Message messageDto = objectMapper.readValue(jsonMessage, ClaudeResponseDto.Message.class);
                claudeResponseDto.setMessage(messageDto);
                System.out.println("messageDto");
                System.out.println(messageDto);
            } catch(JsonProcessingException e) {
                System.out.println("JsonProcessingException"+e.getMessage());
                //재시도하라는 메시지 보내자
//                claudeResponseDto.setErrorMessage("답변이 json 형식을 따르지 않음 오류");
                claudeResponseDto.setErrorMessage("다시 시도해주세요");
            }
//        } else if (claudeResponseApiDto.getType().equals("error")) { //api 에러날 시
//            System.out.println("claudeResponseApiDto.getType().equals(\"error\")");
            //어떤 오류인지에 따라 메시지 달리하기
//            claudeResponseDto.setErrorMessage("ai api 오류");
//        }
        return claudeResponseDto;
    }


    @Override
    public Mono<ClaudeResponseApiDto> sendApiRequest(String prompt) {
        ClaudeRequestApiDto request = ClaudeRequestApiDto.builder()
                .model(modelVersion)
                .messages(List.of(ClaudeRequestApiDto.Message.builder()
                        .role("user")
                        .content(prompt)
                        .build()))
                .max_tokens(maxTokens)
                .build();

        return claudeConfig.getWebClient().post()
                .bodyValue(request)
                .retrieve()
//                .onStatus(status -> status.is4xxClientError(), clientResponse -> Mono.just(new ClaudeClientException(clientResponse)))
//                .onStatus(status -> status.is5xxServerError(), clientResponse -> Mono.just(new ClaudeServerException()))
                .bodyToMono(ClaudeResponseApiDto.class)
                .onErrorResume(error -> {
                    System.out.println("Claude Api Error: "+ error.getMessage());
                    return Mono.just(ClaudeResponseApiDto.getClaudeErrorDto(error.getMessage()));
                });
    }

    @Override
    public Mono<ClaudeResponseApiDto> sendBatchApiRequest(String prompt) {
        return null;
    }


}
