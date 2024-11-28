package writeguidekrGroup.writeguidekr.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import writeguidekrGroup.writeguidekr.domain.entity.Member;
//import writeguidekrGroup.writeguidekr.service.MemberService;
import writeguidekrGroup.writeguidekr.service.PrincipalDetailsService;

@RestController             //이 안에 @ResponseBody 포함됨
@RequiredArgsConstructor
public class HomeController {
//    private final MemberService memberServiceImpl;
    private final PrincipalDetailsService principalDetailsService;


//    //프론트, 서버 따로 배포할 경우 homeUrl와 아래 함수 사용
//    private String homeUrl = "http://localhost:3000";      //!도메인 바꾸면 바꾸기
//    private ResponseEntity<?> redirect(String redirectUrl) {
//        // 302 Found 상태 코드와 Location 헤더를 설정하여 리다이렉션
//        return ResponseEntity.status(HttpStatus.FOUND)  // 302 Found 이 status 보내면 자동으로 해당 링크로 redirect됨
//                .header("Location", redirectUrl)  // 리다이렉션 URL
//                .build();
//    }
//
//
//    @GetMapping("/logout-success")
//    @ResponseBody
//    public ResponseEntity<?> redirectLogout() {
////    public ResponseEntity<?> redirectLogout(RedirectAttributes redirectAttributes) {
//        System.out.println("로그아웃 성공");
//        return redirect(homeUrl+"/login");
//    }


    @GetMapping("/nickname")
    @ResponseBody
    public ResponseEntity<?> redirectLogout(Authentication auth){
        if (auth == null || !auth.isAuthenticated()) {
            //로그아웃된 상황
            return ResponseEntity.ok().body("non-member");
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");    //401 출력
        }
        String memberLoginId = auth.getName();      //id
        Member member = principalDetailsService.loadMemberByLoginId(memberLoginId);

        // 사용자 정보 반환
        return ResponseEntity.ok().body(member.getNickname());
    }

    @GetMapping("/token-sum")
    @ResponseBody
    public ResponseEntity<?> getTokenSum(Authentication auth){
        if (auth == null || !auth.isAuthenticated()) {
            //로그아웃된 상황
            return ResponseEntity.ok().body("non-member");
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");    //401 출력
        }
        String memberLoginId = auth.getName();      //id
        Member member = principalDetailsService.loadMemberByLoginId(memberLoginId);

        return ResponseEntity.ok().body(member.getTokenSum());
    }
}
