package writeguidekrGroup.writeguidekr.config;

//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import writeguidekrGroup.writeguidekr.auth.oauth.PrincipalOauth2UserService;

// 참고 링크1(다양한 로그인 방법) : https://chb2005.tistory.com/173
// WebSecurityConfigurerAdapter을 더이상 사용할 수 없게 되어 SecurityFilterChain로 변경됨
//authorizeRequests를 authorizeHttpRequests로 변경

@Configuration
@EnableWebSecurity          //스프링 시큐리티 설정을 정의하는 클래스임을 나타냄
@RequiredArgsConstructor
/*
* 인증,인가 설정을 controller에서 할 수 있도록 함.
* 자기 아이디만 접근 가능하도록 할 수 있음 저장한 노트 리스트 볼때 사용해보자
* 참고:https://velog.io/@shon5544/Spring-Security-4.-%EA%B6%8C%ED%95%9C-%EC%B2%98%EB%A6%AC
*
@EnableMethodSecurity(securedEnabled = true, prePostEnabled = true)
 */


/*
 * 로그인시 사용되는 보안 클래스
 * */
public class SecurityConfig {

    private final PrincipalOauth2UserService principalOauth2UserService;


    @Bean
    /*
     * 로그인이 필요한 or 인가가 필요한 페이지 설정
     * */
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())       //세션상태 유지할때 CSRF보호를 위한 것, stateless API인 경우(쿠키 대신 토큰을 사용하는 경우) 비활성화(코드를 쓰는게 비활성화하는것임)(보안을 위해 개발중일때만 해당코드 활성화하기)
                //!api 사용으로 authorizeHttpRequests은 사용하지 않고 컨트롤러에서 관리하기로 결정
//                .authorizeHttpRequests(authorize -> authorize
                                //(인증 여부 확인) 로그인된 사용자만 접근 가능하도록 함
//                                .requestMatchers(LOGIN_TYPE+"/info").authenticated()
//                                .requestMatchers("/product/form/**").authenticated()
                                //(인가 여부 확인) UserRole이 ADMIN인 사용자만 접근 가능하도록 함
//                                .requestMatchers(LOGIN_TYPE+"/admin/**").hasAuthority(UserRole.ADMIN.name())
                                //위에서 정의된 경로 외의 것은 모두 접근 가능
//                                .anyRequest().permitAll()
//                )
                //Oauth 로그인
                .oauth2Login(oauth2 -> oauth2
                                .loginPage("/login-page") // 로그인 접근 경로. 이 경로로 get요청할 경우 naver버튼,google버튼이 있는 페이지를 출력한다
//                  .failureUrl("/login?error=true") // 로그인 실패 시 경로
                                .defaultSuccessUrl("/",true) // 로그인 성공 후 리다이렉트 경로
                                .userInfoEndpoint(userInfo -> userInfo
                                        .userService(principalOauth2UserService))         // 사용자의 정보 처리하기
                )
                .logout(logout -> logout
                        .logoutUrl("/logout") // 로그아웃 요청 경로
                        .logoutSuccessUrl("/login-page") // 로그아웃 성공 후 리다이렉트
                        .invalidateHttpSession(true) // 세션 무효화
                        .deleteCookies("JSESSIONID") // 쿠키 삭제
                );
        return http.build();
    }

    /*
     * 비밀번호 암호화, 비밀번호 체크할때 사용
     * 처음 앱 실행시 호출됨
     * */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}


