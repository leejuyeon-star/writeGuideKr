package writeguidekrGroup.writeguidekr.api;

import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import writeguidekrGroup.writeguidekr.api.dto.ClaudeResponseApiDto;
import writeguidekrGroup.writeguidekr.domain.dto.claude.ClaudeResponseDto;

@Service
public interface ClaudeService {
    Mono<ClaudeResponseApiDto> sendApiRequest(String prompt);

    Mono<ClaudeResponseApiDto> sendBatchApiRequest(String prompt);

    //json 형식으로 리턴받기 (마지막 }은 안나온다..)
    //system 변수에 in json 형식 적어주어야 함
    Mono<ClaudeResponseDto> sendApiRequestWithJson(String system, String prompt);

    ClaudeResponseDto formatIntoResponseDto(boolean isNetworkError, ClaudeResponseApiDto claudeResponseApiDto);

    Mono<ClaudeResponseDto> sendCustomError(String msg);
}
