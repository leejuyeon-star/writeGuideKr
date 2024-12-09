package writeguidekrGroup.writeguidekr.api;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import writeguidekrGroup.writeguidekr.api.dto.ClaudeRequestApiDto;
import writeguidekrGroup.writeguidekr.api.dto.ClaudeResponseApiDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import writeguidekrGroup.writeguidekr.domain.dto.claude.ClaudeResponseDto;
import writeguidekrGroup.writeguidekr.service.PrincipalDetailsService;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeoutException;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClaudeServiceImpl implements ClaudeService {
    private final ClaudeConfig claudeConfig;

    private String modelVersion = "claude-3-haiku-20240307";
//    private String modelVersion = "claude-3-5-haiku-20241022";
    private int maxTokens = 1000;


    @Override
    public Mono<ClaudeResponseDto> sendApiRequestWithJson(String system, String prompt) {
        ArrayList<String> stopSequences = new ArrayList<>();
        stopSequences.add("}");                             //마지막에 json 형식이 아닌 다른 서론은 안나오도록 하기

        ClaudeRequestApiDto request = ClaudeRequestApiDto.builder()
                .model(modelVersion)
                .system(system)
                .stop_sequences(stopSequences)
                .max_tokens(maxTokens)
                .build();

        request.setMessages("\""+prompt+"\"", "{");       //처음에 json 형식이 아닌 다른 서론은 안나오도록 하기

        return claudeConfig.getWebClient().post()
                .bodyValue(request)
                .retrieve()
                .bodyToMono(ClaudeResponseApiDto.class)
                .map(data -> {
                    //데이터 형변환
                    return formatIntoResponseDto(false, data);
                })
                .timeout(Duration.ofSeconds(10))
                .doOnError(TimeoutException.class, e -> {
                    //타임아웃 에러 단순 확인용, 이 함수로 값 변경은 불가
                    log.warn("api 요청 시간 초과");
                })
                .onErrorResume(error -> {
                    log.error("Claude측의 오류: "+error.getMessage());
                    return Mono.just(formatIntoResponseDto(true, null));
//                    return Mono.just(ClaudeResponseDto.getClaudeErrorDto(error.getMessage()));
                });
    }

    @Override
    public ClaudeResponseDto formatIntoResponseDto(boolean isNetworkError, ClaudeResponseApiDto claudeResponseApiDto)  {
        ClaudeResponseDto claudeResponseDto = new ClaudeResponseDto();
        if (isNetworkError) {
            claudeResponseDto.setErrorMessage("ai api 오류");
            return claudeResponseDto;
        }
        // JSON 문자열을 Java 객체로 변환할 ObjectMapper 생성
        ObjectMapper objectMapper = new ObjectMapper();
        String message = claudeResponseApiDto.getContent().get(0).getText();
        if (message.charAt(0) != '{') {
            message = '{'+message;
        }
        if ((message.charAt(message.length()-1)) != '}') {
            message = message + '}';
        }
        String jsonMessage = message;
        try {
            ClaudeResponseDto.Message messageDto = objectMapper.readValue(jsonMessage, ClaudeResponseDto.Message.class);
            claudeResponseDto.setMessage(messageDto);
        } catch(JsonProcessingException e) {
            log.warn("JsonProcessingException (답변이 json 형식을 따르지 않음 오류):"+e.getMessage());
            //재시도하라는 메시지 보내자
            claudeResponseDto.setErrorMessage("다시 시도해주세요");
        }
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
                .bodyToMono(ClaudeResponseApiDto.class)
                .timeout(Duration.ofSeconds(10))
                .doOnError(TimeoutException.class, e -> {
                    //타임아웃 에러 단순 확인용, 이 함수로 값 변경은 불가
                    log.warn("api 요청 시간 초과");
                })
                .onErrorResume(error -> {
                    log.error("Claude측의 오류: "+error.getMessage());
                    return Mono.just(ClaudeResponseApiDto.getClaudeErrorDto(error.getMessage()));
                });
    }

    @Override
    public Mono<ClaudeResponseApiDto> sendBatchApiRequest(String prompt) {
        return null;
    }

    @Override
    public Mono<ClaudeResponseDto> sendCustomError(String msg) {
        ClaudeResponseDto claudeResponseDto = new ClaudeResponseDto();
        claudeResponseDto.setErrorMessage(msg);
        return Mono.just(claudeResponseDto);
    }

    @Override
    public ClaudeResponseDto formatIntoResponseDto(String firstResponse, String secondResponse, String thirdResponse){
        ClaudeResponseDto claudeResponseDto = new ClaudeResponseDto();
            ClaudeResponseDto.Message messageDto =
                    ClaudeResponseDto.Message.builder()
                            .fir(firstResponse)
                            .sec(secondResponse)
                            .thir(thirdResponse)
                            .build();
            claudeResponseDto.setMessage(messageDto);

        return claudeResponseDto;
    }



}
