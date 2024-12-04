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

    @Transactional
    public void deleteMember(Member member){
        memberRepository.delete(member);
    }

    public boolean hasToken(Member member) {
        if (member.getTokenSum() > 0) {
            return true;
        } else {
            return false;
        }
    }


    @Transactional
    public int useToken(Member member) {
        member.minusTokenSum(1);
//        System.out.println("use 1 token. current token sum:"+member.getTokenSum());
        memberRepository.save(member);
        return member.getTokenSum();
    }

    int PLUS_HOUR = 4;       //최초 api 요청 4시간 이후 토큰 갱신
    int UPDATE_TOKEN_COUNT = 10;    //토큰 갱신 수량 (최대값임, 기존값에 더하는것 x)

    @Transactional
    public void updateTokenSumAndRefreshTime(Member member) {
        member.adjustTokenSumAndRefreshTime(UPDATE_TOKEN_COUNT, PLUS_HOUR);
        memberRepository.save(member);
    }



}