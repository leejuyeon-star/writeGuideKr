package writeguidekrGroup.writeguidekr.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import writeguidekrGroup.writeguidekr.api.ClaudeService;
import writeguidekrGroup.writeguidekr.domain.dto.claude.ApiAfterSentenceRequestDto;
import writeguidekrGroup.writeguidekr.domain.dto.claude.ApiBetweenPhraseRequestDto;
import writeguidekrGroup.writeguidekr.api.dto.ClaudeResponseApiDto;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import writeguidekrGroup.writeguidekr.domain.dto.claude.ClaudeResponseDto;
import writeguidekrGroup.writeguidekr.domain.entity.Member;
import writeguidekrGroup.writeguidekr.service.PrincipalDetailsService;

import java.time.Duration;

@RestController             //이 안에 @ResponseBody 포함됨
@RequiredArgsConstructor
//@RequestMapping("/api/claude")        //이걸 설정하면 비동기가 아닌 동기적으로 동작함
public class ClaudeController {
    private final ClaudeService claudeService;
    private final PrincipalDetailsService principalDetailsService;

    @PostMapping("/api/claude/")
    public Mono<ClaudeResponseApiDto> request(@RequestBody String prompt) {
        return claudeService.sendApiRequest("say hi");
    }

    //api를 호출할 자격이 있는지 검사
    private Mono<ClaudeResponseDto> isMemberQualified(Authentication auth){
        //회원인지 확인
        if (auth == null || !auth.isAuthenticated()) {
            //로그아웃된 상황
            return claudeService.sendCustomError("로그인이 필요합니다.");
        }

        String memberLoginId = auth.getName();      //id

        // 토큰이 1개 이상 있는지 확인
        Member member = principalDetailsService.loadMemberByLoginId(memberLoginId);
        if (member == null){
            return claudeService.sendCustomError("로그인이 필요합니다.");
        }
        if (!principalDetailsService.hasToken(member)){
            return claudeService.sendCustomError("토큰이 부족합니다.");
        }

        //정상인 경우 null 리턴
        return null;
    }

    @PostMapping("/api/claude/aftersentence")
    public Mono<ClaudeResponseDto> apiRecommendAfterSentenceRequest(Authentication auth, @RequestBody ApiAfterSentenceRequestDto apiAfterSentenceRequestDto) {

        Mono<ClaudeResponseDto> errorResponse = isMemberQualified(auth);
        if (errorResponse != null) return errorResponse;


        String targetSentence = apiAfterSentenceRequestDto.getTargetSentence();

        Mono<ClaudeResponseDto> responseDtoMono = claudeService.sendApiRequestWithJson(
//                "Suggest 3 Korean phrases that make an addition this last phrase. The phrases should be under 6 words in JSON format: {\"fir\":\"first\",\"sec\":\"second\",\"thir\":\"third\"}",
                "suggest 3 Korean phrases to complete this sentence. The phrases should be under 10 words in JSON format: {\"fir\":\"first\",\"sec\":\"second\",\"thir\":\"third\"}",
//                "Suggest 3 Korean phrases that naturally follow this last phrase. The phrases should be under 6 words in JSON format: {\"fir\":\"first\",\"sec\":\"second\",\"thir\":\"third\"}",
                targetSentence
        );


        String memberLoginId = auth.getName();      //id
        Member member = principalDetailsService.loadMemberByLoginId(memberLoginId);
        responseDtoMono.subscribe(value -> {
            if ((value.getErrorMessage()).equals("")){
                //api가 성공적으로 동작한 경우
                //성공 확인 후 토큰 1개 소모
                principalDetailsService.updateTokenSumAndRefreshTime(member);
                principalDetailsService.useToken(member);
            }
        });

        return responseDtoMono;
    }




    @PostMapping("/api/claude/betweenphrase")
    public Mono<ClaudeResponseDto> apiRecommendBetweenPhraseRequest(Authentication auth, @RequestBody ApiBetweenPhraseRequestDto apiBetweenPhraseRequestDto) {

        Mono<ClaudeResponseDto> errorResponse = isMemberQualified(auth);
        if (errorResponse != null) return errorResponse;


        String targetWord = apiBetweenPhraseRequestDto.getTargetWord();
        String targetSentence = apiBetweenPhraseRequestDto.getTargetSentence();
        String targetBeforeWord = apiBetweenPhraseRequestDto.getTargetBeforeWord();
//        System.out.println(String.format("%s %s", String.format("Replace '%s' that appears after '%s' with 3 alternative phrases in the following sentence. Follow JSON format: {\"fir\":\"first\",\"sec\":\"second\",\"thir\":\"third\"}", targetWord, targetBeforeWord)
//        , targetSentence));

        Mono<ClaudeResponseDto> responseDtoMono;
        if (targetBeforeWord != null) {
            //중복된 단어가 존재하는 경우
            responseDtoMono = claudeService.sendApiRequestWithJson(
                    String.format("Replace '%s' that appears after '%s' with 3 alternative phrases in the following sentence. Follow JSON format: {\"fir\":\"first\",\"sec\":\"second\",\"thir\":\"third\"}", targetWord, targetBeforeWord),
                    targetSentence
            );
        } else {
            //중복된 단어 존재하지 않는 경우
            responseDtoMono = claudeService.sendApiRequestWithJson(
                    String.format("Replace '%s' with 3 alternative phrases in the following sentence. Follow JSON format: {\"fir\":\"first\",\"sec\":\"second\",\"thir\":\"third\"}", targetWord),
                    targetSentence
            );
        }

        String memberLoginId = auth.getName();      //id
        Member member = principalDetailsService.loadMemberByLoginId(memberLoginId);
        responseDtoMono.subscribe(value -> {
            if ((value.getErrorMessage()).equals("")){
                //api가 성공적으로 동작한 경우
                //토큰 소모 or 갱신, 갱신 시간 수정
                principalDetailsService.updateTokenSumAndRefreshTime(member);
                principalDetailsService.useToken(member);
            }
        });

        return responseDtoMono;
    }



    //튜토리얼용
    @GetMapping("/api/claude/tutorial/aftersentence")
    public Mono<ClaudeResponseDto> afterSentenceRequestForTutorial() {
        String firstResponse = "글쓰기 도움을 받으세요.";
        String secondResponse = "주시면 감사하겠습니다.";
        String thirdResponse = "시작하세요.";

        Mono<ClaudeResponseDto> responseDtoMono =
                Mono.just(claudeService.formatIntoResponseDto(firstResponse, secondResponse, thirdResponse))
                    .delayElement(Duration.ofSeconds(2));

        return responseDtoMono;
    }

    //튜토리얼용
    @GetMapping("/api/claude/tutorial/betweenphrase")
    public Mono<ClaudeResponseDto> afterSentenceBetweenPhraseForTutorial() {
        String firstResponse = "적절한";
        String secondResponse = "걸맞는";
        String thirdResponse = "어울리는";

        Mono<ClaudeResponseDto> responseDtoMono =
                Mono.just(claudeService.formatIntoResponseDto(firstResponse, secondResponse, thirdResponse))
                        .delayElement(Duration.ofSeconds(2));

        return responseDtoMono;
    }

}

