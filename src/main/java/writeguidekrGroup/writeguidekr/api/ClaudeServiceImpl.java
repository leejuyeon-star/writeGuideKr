package writeguidekrGroup.writeguidekr.api;

import writeguidekrGroup.writeguidekr.api.dto.ClaudeRequestApiDto;
import writeguidekrGroup.writeguidekr.api.dto.ClaudeResponseApiDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClaudeServiceImpl implements ClaudeService {
    private final ClaudeConfig claudeConfig;

    private String modelVersion = "claude-3-haiku-20240307";
    private int maxTokens = 1000;


    public Mono<ClaudeResponseApiDto> sendApiRequestWithJson(String system, String prompt) {
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
                .onErrorResume(error -> {
                    System.out.println("Claude Api Error: "+ error.getMessage());
                    return Mono.just(ClaudeResponseApiDto.getClaudeErrorDto(error.getMessage()));
                });
    }


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


}
