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

    //form login의 경우 login하는 post 컨트롤러를 만들지 않아도 된다
//    private String LOGIN_TYPE = "/form-login";

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
//                .requestMatchers(LOGIN_TYPE+"/info").authenticated()
//                                .requestMatchers("/product/form/**").authenticated()
//                                .requestMatchers("/account").authenticated()
                                //(인가 여부 확인) UserRole이 ADMIN인 사용자만 접근 가능하도록 함
//                .requestMatchers(LOGIN_TYPE+"/admin/**").hasAuthority(UserRole.ADMIN.name())
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


//                .formLogin(formLogin -> formLogin                           //로그인시 form login 방식을 사용하겠다고 선언
//                                .usernameParameter("loginId")                       // html에서 'username'대신 'loginId'를 사용하겠다고 명시
//                                .passwordParameter("password")
//                                .loginPage(LOGIN_TYPE+"/login")                     //로그인 페이지 url
//                                .loginProcessingUrl(LOGIN_TYPE+"/login")                          // 로그인 처리 URL (여기에 POST 요청이 들어오면 Spring Security가 처리)
//                                .defaultSuccessUrl(LOGIN_TYPE)                   //로그인 성공시 이동할 url
////                        .failureUrl(LOGIN_TYPE+"/login")    //로그인 실패시 이동할 url
//                                .failureHandler(new CustomAuthenticationFailureHandler()) // 커스텀 실패 핸들러
//                )
//                .logout(logout -> logout
//                        .logoutUrl(LOGIN_TYPE+"/logout")                    //로그아웃 페이지 url
//                        .invalidateHttpSession(true)
//                        .deleteCookies("JSESSIONID")
//                )
//        ;
//                .exceptionHandling(exceptionHandling -> exceptionHandling
//                        .authenticationEntryPoint(new CustomAuthenticationEntryPoint()) // 사용자 정의 EntryPoint 설정
//                );
        return http.build();
    }


//
//
//    //로그인 실패시 에러메세지를 보내는 함수
//    public class CustomAuthenticationFailureHandler implements AuthenticationFailureHandler {
//
//        @Override
//        public void onAuthenticationFailure(HttpServletRequest request,
//                                            HttpServletResponse response,
//                                            AuthenticationException exception) throws IOException, ServletException {
//            System.out.println("Login failed: " + exception.getMessage());
//
//            String errorMessage;
//            if (exception instanceof BadCredentialsException) {
//                errorMessage = "아이디 또는 비밀번호가 맞지 않습니다. 다시 확인해 주세요.";
//            } else if (exception instanceof InternalAuthenticationServiceException) {
//                errorMessage = "내부적으로 발생한 시스템 문제로 인해 요청을 처리할 수 없습니다. 관리자에게 문의하세요.";
//            } else if (exception instanceof UsernameNotFoundException) {
//                errorMessage = "계정이 존재하지 않습니다. 회원가입 진행 후 로그인 해주세요.";
//            } else if (exception instanceof AuthenticationCredentialsNotFoundException) {
//                errorMessage = "인증 요청이 거부되었습니다. 관리자에게 문의하세요.";
//            } else {
//                errorMessage = "알 수 없는 이유로 로그인에 실패하였습니다 관리자에게 문의하세요.";
//            }
//            System.out.println(errorMessage);
//
//            // 세션에 에러 메시지 저장 (세션에 저장함으로써 URI에 에러메시지가 노출되지 않도록 한다)
//            HttpSession session = request.getSession(true);         //현 세션 가져오기, 세션이 없으면 새로 생성
//            session.setAttribute(SessionConst.ERRORMASSAGE.name(), "Login failed: " + errorMessage);      //세션 저장소에 저장
//
//            // 로그인 페이지로 리다이렉트
//            response.sendRedirect(request.getContextPath() + LOGIN_TYPE + "/login");
//        }
//
//    }

    /*
     * 비밀번호 암호화, 비밀번호 체크할때 사용
     * 처음 앱 실행시 호출됨
     * */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}


