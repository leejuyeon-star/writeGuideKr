package writeguidekrGroup.writeguidekr.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import writeguidekrGroup.writeguidekr.auth.PrincipalDetails;
import writeguidekrGroup.writeguidekr.domain.entity.Member;
import writeguidekrGroup.writeguidekr.repository.MemberRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PrincipalDetailsService implements UserDetailsService{


    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Member member = memberRepository.findByLoginId(username)
                .orElseThrow(() -> {
                    return new UsernameNotFoundException("해당 유저를 찾을 수 없습니다.");
                });
        return new PrincipalDetails(member);
    }


    public Member loadMemberByLoginId(String loginId) {
        Optional<Member> optionalMember = memberRepository.findByLoginId(loginId);
        Member member = null;

        if(!optionalMember.isEmpty()) {
            member = optionalMember.get();
        }
        return member;
    }

    public boolean hasToken(String loginId) {
        Member member = loadMemberByLoginId(loginId);
        if (member == null){
            return false;
        }
        if (member.getTokenSum() > 0) {
            return true;
        } else {
            return false;
        }
    }


    @Transactional
    public int useToken(String loginId) {
        Member member = loadMemberByLoginId(loginId);
        member.minusTokenSum(1);
        return member.getTokenSum();
    }

}