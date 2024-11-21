package writeguidekrGroup.writeguidekr.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import writeguidekrGroup.writeguidekr.service.PrincipalDetailsService;

@RestController             //이 안에 @ResponseBody 포함됨
@RequiredArgsConstructor
public class HomeController {
    private final PrincipalDetailsService principalDetailsService;
//    @PostMapping("/api/test")
//    public Map<String, Object> postRequest(@RequestBody ClaudeRequestDto claudeRequestDto) {
//        Map<String, Object> response = new HashMap<>();
//        response.put("targetSentence", claudeRequestDto.getTargetSentence());
//        response.put("targetWord", claudeRequestDto.getTargetWord());
//        response.put("targetWordIdx", claudeRequestDto.getTargetWordIdx());
//        return response;
//    }
//
//    @GetMapping("/api/test")
//    public Map<String, Object> getRequest(@RequestParam(value="ID") int id) {
//        Map<String, Object> response = new HashMap<>();
//        response.put("ID", id);
//        return response;
//    }
//    @GetMapping("/")
//    public ResponseEntity<?> home() {
//
//    }

//    @GetMapping("/login")
//    public ResponseEntity<?> initCreationLogin() {
////        principalDetailsService.loadUserByUsername(username)
//        return ResponseEntity.ok("사용자명");
//    }

    private String homeUrl = "http://localhost:3000";      //!도메인 바꾸면 바꾸기

    private ResponseEntity<?> redirect(String redirectUrl) {
        // 302 Found 상태 코드와 Location 헤더를 설정하여 리다이렉션
        return ResponseEntity.status(HttpStatus.FOUND)  // 302 Found 이 status 보내면 자동으로 해당 링크로 redirect됨
                .header("Location", redirectUrl)  // 리다이렉션 URL
                .build();
    }

    @GetMapping("/login-success")
    public ResponseEntity<?> redirectLogin() {
        return redirect(homeUrl);
    }

    @GetMapping("/logout-success")
    public ResponseEntity<?> redirectLogout() {
        return redirect(homeUrl);
    }

//    @GetMapping("/logout-success")
//    @ResponseBody
//    public ResponseEntity<?> redirectLogout() {
////    public ResponseEntity<?> redirectLogout(RedirectAttributes redirectAttributes) {
//        System.out.println("로그아웃 성공");
////        return redirect(homeUrl);
//        return redirect(homeUrl+"/login");
//    }

//    @PostMapping("/api/logout")
//    public void ddd() {
//        System.out.println("엥");
//    }
}
