package writeguidekrGroup.writeguidekr.controller;
import writeguidekrGroup.writeguidekr.api.ClaudeService;
import writeguidekrGroup.writeguidekr.domain.dto.claude.ApiAfterSentenceRequestDto;
import writeguidekrGroup.writeguidekr.domain.dto.claude.ApiBetweenPhraseRequestDto;
import writeguidekrGroup.writeguidekr.api.dto.ClaudeResponseApiDto;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import writeguidekrGroup.writeguidekr.domain.dto.claude.ClaudeResponseDto;

@RestController             //이 안에 @ResponseBody 포함됨
@RequiredArgsConstructor
//@RequestMapping("/api/claude")        //이걸 설정하면 비동기가 아닌 동기적으로 동작함
public class ClaudeController {
    private final ClaudeService claudeService;

    @PostMapping("/api/claude/")
    public Mono<ClaudeResponseApiDto> request(@RequestBody String prompt) {
        return claudeService.sendApiRequest("say hi");
    }

    @PostMapping("/api/claude/aftersentence")
    public Mono<ClaudeResponseDto> apiRecommendAfterSentenceRequest(@RequestBody ApiAfterSentenceRequestDto apiAfterSentenceRequestDto) {
        String targetSentence = apiAfterSentenceRequestDto.getTargetSentence();
        System.out.println("apiRecommendAfterSentenceRequest");

        System.out.println("apiAfterSentenceRequestDto");
        System.out.println(apiAfterSentenceRequestDto);
        System.out.println("targetSentence");
        System.out.println(targetSentence);


        Mono<ClaudeResponseDto> responseDtoMono = claudeService.sendApiRequestWithJson(
                "Suggest 3 Korean phrases that naturally follow this sentence. The phrases should be under 6 words in JSON format: {\"fir\":\"first\",\"sec\":\"second\",\"thir\":\"third\"}",
                targetSentence
        );


//        Mono<ClaudeResponseDto> responseDtoMono = claudeService.sendApiRequestWithJson(
//                "Suggest 3 Korean phrases that naturally follow this sentence. The phrases should be under 6 words in JSON format: {\"fir\":\"first\",\"sec\":\"second\",\"thir\":\"third\"}",
//                "이로 인해 유전적 질병의 치료뿐만 아니라 자질 강화는 물론이고 자녀의 유전자마저 결정할 수 있다. 바야흐로 인간은 자연 진화의 주인 자리에 올라 진정"
//        );

        return responseDtoMono;
    }




    @PostMapping("/api/claude/betweenphrase")
    public Mono<ClaudeResponseDto> apiRecommendPhraseRequest(@RequestBody ApiBetweenPhraseRequestDto apiBetweenPhraseRequestDto) {
        String targetWord = apiBetweenPhraseRequestDto.getTargetWord();
        String targetSentence = apiBetweenPhraseRequestDto.getTargetSentence();
        String targetBeforeWord = apiBetweenPhraseRequestDto.getTargetBeforeWord();
        System.out.println(String.format("%s %s", String.format("Replace '%s' that appears after '%s' with 3 alternative phrases in the following sentence. Follow JSON format: {\"fir\":\"first\",\"sec\":\"second\",\"thir\":\"third\"}", targetWord, targetBeforeWord)
        , targetSentence));
        System.out.println("apiRecommendPhraseRequest");

        Mono<ClaudeResponseDto> responseDtoMono;
        if (targetBeforeWord != null) {
            //중복된 단어가 존재하는 경우
            System.out.println("중복된 단어가 존재하는 경우");
            responseDtoMono = claudeService.sendApiRequestWithJson(
                    String.format("Replace '%s' that appears after '%s' with 3 alternative phrases in the following sentence. Follow JSON format: {\"fir\":\"first\",\"sec\":\"second\",\"thir\":\"third\"}", targetWord, targetBeforeWord),
                    targetSentence
            );
        } else {
            System.out.println("중복된 단어 존재하지 않는 경우");
            //중복된 단어 존재하지 않는 경우
            responseDtoMono = claudeService.sendApiRequestWithJson(
                    String.format("Replace '%s' with 3 alternative phrases in the following sentence. Follow JSON format: {\"fir\":\"first\",\"sec\":\"second\",\"thir\":\"third\"}", targetWord),
                    targetSentence
            );
        }


//        responseApiDtoMono.subscribe(
//                (data) -> System.out.println("( 정상작동 or api에러 )Index : " + data),   //여기서 ClaudeResponseApiDto를 ClaudeResponseDto로 바꿔
//                (error) -> System.err.println("백엔드 Error : " + error.getMessage())
//        );

//        Mono<ClaudeResponseDto> responseDtoMono = Mono.empty();
//        responseApiDtoMono.subscribe(
//                    //답변 형식 변경 (ClaudeResponseApiDto를 ClaudeResponseDto로 바꾸기)
//                (responseApiDto) -> {
////                    claudeRequestApiDto.getContent();
//                    System.out.println("claudeRequestApiDto");
////                    System.out.println(claudeRequestApiDto);
//                    ClaudeResponseDto claudeResponseDto = claudeService.formatIntoResponseDto(false, responseApiDto);
//                    Mono<ClaudeResponseDto> responseDtoMono = Mono.just(claudeResponseDto);
////                    return responseDtoMono;
//                },
//                (error) -> {
//                    ClaudeResponseDto claudeResponseDto = claudeService.formatIntoResponseDto(true, null);
//                    return claudeResponseDto;
//                }
//
//        );

        return responseDtoMono;
    }
}

