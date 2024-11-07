package writeguidekrGroup.writeguidekr.controller;
import writeguidekrGroup.writeguidekr.api.ClaudeService;
import writeguidekrGroup.writeguidekr.api.dto.ClaudeRequestDto;
import writeguidekrGroup.writeguidekr.api.dto.ClaudeResponseApiDto;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController             //이 안에 @ResponseBody 포함됨
@RequiredArgsConstructor
@RequestMapping("/api/claude")
public class ClaudeController {
    private final ClaudeService claudeService;

    // postman에 "Hello"라고 하면 답변 온다
    @PostMapping("/")
    public Mono<ClaudeResponseApiDto> request(@RequestBody String prompt) {
//        String prompt = claudeRequestDto.get
        return claudeService.sendApiRequest("say hi");
    }

    @PostMapping("/aftersentence")
    public Mono<ClaudeResponseApiDto> apiRecommendAfterSentenceRequest(@RequestBody String prompt) {
        return claudeService.sendApiRequestWithJson(
                "Suggest 3 Korean phrases that naturally follow this sentence. The phrases should be under 6 words in JSON format: {'1':'first','2':'second','3':'third'}",
                "이로 인해 유전적 질병의 치료뿐만 아니라 자질 강화는 물론이고 자녀의 유전자마저 결정할 수 있다. 바야흐로 인간은 자연 진화의 주인 자리에 올라 진정"
        );

//        return claudeService.sendApiRequestWithJson(
//                "Suggest 3 Korean phrases that naturally follow this sentence. The phrases should be under 6 words in JSON format: {'1':'first','2':'second','3':'third'}",
//                prompt
//        );
    }




    @PostMapping("/betweenphrase")
    public Mono<ClaudeResponseApiDto> apiRecommendPhraseRequest(@RequestBody ClaudeRequestDto claudeRequestDto) {
        String targetWord = claudeRequestDto.getTargetWord();
        String targetSentence = claudeRequestDto.getTargetSentence();
        String targetBeforeWord = claudeRequestDto.getTargetBeforeWord();
        System.out.println(String.format("%s %s", String.format("Replace '%s' that appears after '%s' with 3 alternative phrases in the following sentence. Follow JSON format: {'1':'first','2':'second','3':'third'}", targetWord, targetBeforeWord)
        , targetSentence));

        if (targetBeforeWord != null) {
            //중복된 단어가 존재하는 경우
            return claudeService.sendApiRequestWithJson(
                    String.format("Replace '%s' that appears after '%s' with 3 alternative phrases in the following sentence. Follow JSON format: {'1':'first','2':'second','3':'third'}", targetWord, targetBeforeWord),
                    targetSentence
            );

        } else {
            //중복된 단어 존재하지 않는 경우
            return claudeService.sendApiRequestWithJson(
                    String.format("Replace '%s' with 3 alternative phrases in the following sentence. Follow JSON format: {'1':'first','2':'second','3':'third'}", targetWord),
                    targetSentence
            );
        }
    }
}

