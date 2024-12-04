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




//        Mono<ClaudeResponseDto> responseDtoMono = claudeService.sendApiRequestWithJson(
//                "Suggest 3 Korean phrases that naturally follow this sentence. The phrases should be under 6 words in JSON format: {\"fir\":\"first\",\"sec\":\"second\",\"thir\":\"third\"}",
//                "이로 인해 유전적 질병의 치료뿐만 아니라 자질 강화는 물론이고 자녀의 유전자마저 결정할 수 있다. 바야흐로 인간은 자연 진화의 주인 자리에 올라 진정"
//        );

        //프론트에서 이사람이 회원인지 먼저 체크해야하는데? 백엔드에서 비회원이 auth이 아예 없는 경우도 오류 메시지 보내면 되긴 하는데 그게 되나?

        //현재 auth가 유효하지 않으면 유효하지 않다는 오류 내보내기
        //토큰 개수 0이면 토큰 부족하다는 오류 내보내기
        //api 돌리기
            // api 서버 오류 나면 서버 오류 내보내기
            // api 서버 오류 안나면 토큰 개수 줄이고 메시지 내보내기
//        principalDetailsService.

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




    @GetMapping("/api/claude/tutorial/aftersentence")
    public Mono<ClaudeResponseDto> afterSentenceRequestForTutorial() {

//        Mono<ClaudeResponseDto> errorResponse = isMemberQualified(auth);
//        if (errorResponse != null) return errorResponse;


//        String targetSentence = apiAfterSentenceRequestDto.getTargetSentence();
//        System.out.println("apiRecommendAfterSentenceRequest");

//        System.out.println("apiAfterSentenceRequestDto");
//        System.out.println(apiAfterSentenceRequestDto);
//        System.out.println("targetSentence");
//        System.out.println(targetSentence);
        String firstResponse = "글쓰기 도움을 받으세요.";
        String secondResponse = "주시면 감사하겠습니다.";
        String thirdResponse = "시작하세요.";

        Mono<ClaudeResponseDto> responseDtoMono =
                Mono.just(claudeService.formatIntoResponseDto(firstResponse, secondResponse, thirdResponse))
                    .delayElement(Duration.ofSeconds(2));

        return responseDtoMono;
    }

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

