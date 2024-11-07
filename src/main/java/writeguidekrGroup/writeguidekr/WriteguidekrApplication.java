package writeguidekrGroup.writeguidekr;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)		//서버 처음에 security 로그인 안해도 들어갈수있게함
//@EnableConfigurationProperties(ClaudeConfig.class)		//yaml에 있는 값을 해당 클래스에 바인딩
public class WriteguidekrApplication {

	public static void main(String[] args) {
		SpringApplication.run(WriteguidekrApplication.class, args);
	}

}
