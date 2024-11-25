//package writeguidekrGroup.writeguidekr.config;
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
////OPTIONS 요청은 브라우저가 CORS(Cross-Origin Resource Sharing) 정책을 확인하기 위해 자동으로 보내는 프리플라이트 요청입니다. 이 요청은 클라이언트가 실제로 데이터를 보내기 전에 서버가 해당 요청을 허용하는지 확인하려고 보냅니다.
////
////        CORS 정책이 제대로 설정되지 않았을 경우, 서버는 OPTIONS 요청을 차단하고 403 Forbidden 상태를 반환할 수 있습니다.
////        해결 방법:
////        서버에서 CORS 설정을 확인하고, OPTIONS 요청을 처리할 수 있도록 설정해야 합니다. 예를 들어, Spring Boot에서는 WebMvcConfigurer를 사용하여 CORS를 설정할 수 있습니다.
//@Configuration
//public class WebConfig implements WebMvcConfigurer {
//
//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**")  // 모든 경로에 대해 CORS를 허용
//                .allowedOrigins("http://localhost:3000")  // React 앱의 주소
//                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // 허용할 HTTP 메소드
//                .allowCredentials(true);  // 세션 쿠키를 포함한 요청을 허용
//    }
//}
