package writeguidekrGroup.writeguidekr.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import writeguidekrGroup.writeguidekr.domain.dto.AccountDto;
import writeguidekrGroup.writeguidekr.domain.entity.Member;
//import writeguidekrGroup.writeguidekr.service.MemberService;
import writeguidekrGroup.writeguidekr.service.PrincipalDetailsService;

@RestController             //이 안에 @ResponseBody 포함됨
@RequiredArgsConstructor
public class HomeController {
//    private final MemberService memberServiceImpl;
    private final PrincipalDetailsService principalDetailsService;


    // 단순 회원 정보 갱신을 목표로 하는 함수
    // 토큰 개수, 토큰시간 갱신, 로그인여부, 이름,
    @GetMapping("/member-account")
    @ResponseBody
    public ResponseEntity<?> getAccount(Authentication auth){
        AccountDto dto;
        if (auth == null || !auth.isAuthenticated()) {
            //로그아웃된 상황
            dto = AccountDto.builder()
                    .loginId("")
                    .userName("NON_MEMBER")
                    .tokenSum(0)
                    .nextTokenRefreshTime("00:00")
                    .provider("")
                    .build();
            return ResponseEntity.ok().body(dto);
//            return ResponseEntity.ok().body("non-member");
        }

        String memberLoginId = auth.getName();      //id
        Member member = principalDetailsService.loadMemberByLoginId(memberLoginId);
        principalDetailsService.updateTokenSumAndRefreshTime(member);

        if (member == null) {
            //비로그인인 경우
            dto = AccountDto.builder()
                    .loginId("")
                    .userName("NON_MEMBER")
                    .tokenSum(0)
                    .nextTokenRefreshTime("00:00")
                    .provider("")
                    .build();
        } else {
            dto = AccountDto.builder()
                    .loginId(member.getLoginId())
                    .userName(member.getNickname())
                    .tokenSum(member.getTokenSum())
                    .nextTokenRefreshTime(member.toStringNextTokenRefreshTime())
                    .provider(member.getProvider())
                    .build();
        }

        return ResponseEntity.ok().body(dto);
    }

    @DeleteMapping("/member")
    public ResponseEntity<?> deleteMember(Authentication auth){
        AccountDto dto;
        if (auth == null || !auth.isAuthenticated()) {
            //로그아웃된 상황
            return ResponseEntity.ok().body("NON_MEMBER");
        }
        String memberLoginId = auth.getName();      //id
        Member member = principalDetailsService.loadMemberByLoginId(memberLoginId);

        if (member == null) {
            //비로그인인 경우
            return ResponseEntity.ok().body("NON_MEMBER");
        } else {
            principalDetailsService.deleteMember(member);
            return ResponseEntity.ok().body("success");
        }

    }
}
