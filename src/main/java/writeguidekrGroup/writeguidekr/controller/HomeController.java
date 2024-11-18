package writeguidekrGroup.writeguidekr.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController             //이 안에 @ResponseBody 포함됨
@RequiredArgsConstructor
public class HomeController {

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


}
