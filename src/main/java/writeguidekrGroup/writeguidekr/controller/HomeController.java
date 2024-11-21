package writeguidekrGroup.writeguidekr.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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

    @GetMapping("/login")
    public ResponseEntity<?> initCreationLogin() {
//        principalDetailsService.loadUserByUsername(username)
        return ResponseEntity.ok("사용자명");
    }


    @GetMapping("/login-success")
    public ResponseEntity<Void> redirect() {
        // 리다이렉션 URL 설정
        String redirectUrl = "http://localhost:3000/";      //도메인 바뀌면 바꾸기

        // 302 Found 상태 코드와 Location 헤더를 설정하여 리다이렉션
        return ResponseEntity.status(HttpStatus.FOUND)  // 302 Found 이 status 보내면 자동으로 해당 링크로 redirect됨
                .header("Location", redirectUrl)  // 리다이렉션 URL
                .build();
    }

}
