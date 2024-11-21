package writeguidekrGroup.writeguidekr.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import writeguidekrGroup.writeguidekr.auth.PrincipalDetails;
import writeguidekrGroup.writeguidekr.domain.entity.Member;
import writeguidekrGroup.writeguidekr.repository.MemberRepository;

@Service
@RequiredArgsConstructor
public class PrincipalDetailsService implements UserDetailsService {


    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Member member = memberRepository.findByLoginId(username)
                .orElseThrow(() -> {
                    return new UsernameNotFoundException("해당 유저를 찾을 수 없습니다.");
                });
        return new PrincipalDetails(member);
    }
}