package writeguidekrGroup.writeguidekr.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

//react에 만든 추가 페이지 매핑해주기 위함
@Controller
public class WebController {

    @GetMapping(value =  {"", "/about", "/login-page", "/privacy", "/network-error", "/account"})
    public String forward() {
        System.out.println("forward()");
        return "forward:/index.html";
    }

}
