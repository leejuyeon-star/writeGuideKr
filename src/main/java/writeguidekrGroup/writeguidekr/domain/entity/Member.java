package writeguidekrGroup.writeguidekr.domain.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import writeguidekrGroup.writeguidekr.domain.MemberRole;

@Entity
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String loginId;
    private String password;
    private String nickname;
    private int tokenSum;

    private MemberRole role;

    // OAuth 로그인에 사용
    private String provider;
    private String providerId;

    public void plusTokenSum(int value) {
        tokenSum += value;
    }

    public void minusTokenSum(int value) {
        if (tokenSum <= 0) return;
        tokenSum -= value;
    }

    public void updateTokenSum(int value) {
        if (tokenSum > value) {
            return;
        }
        tokenSum = value;
    }
}