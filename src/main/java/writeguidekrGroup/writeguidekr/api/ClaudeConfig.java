package writeguidekrGroup.writeguidekr.api;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.config.EnableWebFlux;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
//@EnableWebFlux //WebFlux 기능을 활성화
public class ClaudeConfig {
    @Getter
    private WebClient webClient;

    //@Value 관련 문제
    //생성자 생성 후 @Value가 작업을 시작하기 때문에...
    public ClaudeConfig(@Value("${claude-api.api-key}") String secretKey,
                        @Value("${claude-api.base-url}") String baseUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("x-api-key", secretKey)
                .defaultHeader("anthropic-version", "2023-06-01")
                .defaultHeader("content-type", "application/json")
                .build();
    }
}

