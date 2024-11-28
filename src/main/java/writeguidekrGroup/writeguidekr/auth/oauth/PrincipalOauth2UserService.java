package writeguidekrGroup.writeguidekr.auth.oauth;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import writeguidekrGroup.writeguidekr.auth.PrincipalDetails;
import writeguidekrGroup.writeguidekr.domain.MemberRole;
import writeguidekrGroup.writeguidekr.domain.entity.Member;
import writeguidekrGroup.writeguidekr.repository.MemberRepository;

import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PrincipalOauth2UserService extends DefaultOAuth2UserService {
    private final MemberRepository memberRepository;

//    private final BCryptPasswordEncoder encoder;       //비밀번호 암호화, 비밀번호 체크할때 사용

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        log.info("getAttributes: {}", oAuth2User.getAttributes());

        OAuth2UserInfo oAuth2UserInfo = null;

        String provider = userRequest.getClientRegistration().getRegistrationId();

        if(provider.equals("google")) {
            log.info("구글 로그인 요청");
            oAuth2UserInfo = new GoogleUserInfo( oAuth2User.getAttributes() );
        } else if (provider.equals("naver")) {
            log.info("네이버 로그인 요청");
            oAuth2UserInfo = new NaverUserInfo((Map)oAuth2User.getAttributes().get("response"));
        }


        String providerId = oAuth2UserInfo.getProviderId();
        String email = oAuth2UserInfo.getEmail();
        String loginId = provider + "_" + providerId;
        String nickname = oAuth2UserInfo.getName();

        Optional<Member> optionalUser = memberRepository.findByLoginId(loginId);
        Member member = null;

        if(optionalUser.isEmpty()) {
            //회원가입
            member = Member.builder()
                    .loginId(loginId)
                    .nickname(nickname)
                    .provider(provider)
                    .providerId(providerId)
                    .role(MemberRole.USER)
                    .tokenSum(1)       //기본 10 부여
                    .build();
            memberRepository.save(member);
        } else {
            member = optionalUser.get();
        }

        return new PrincipalDetails(member, oAuth2User.getAttributes());
    }


    /*
     * 비밀번호 암호화, 비밀번호 체크할때 사용
     * 처음 앱 실행시 호출됨
     * */
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
}
