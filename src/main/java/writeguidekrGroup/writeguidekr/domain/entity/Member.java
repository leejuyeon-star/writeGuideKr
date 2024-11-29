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

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

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
    private LocalDateTime nextTokenRefreshTime = null;

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
        System.out.println("token update:"+value+"token");
        tokenSum = value;
    }

    

    //갱신 필요 여부 확인 후 토큰과 갱신시간 업데이트
    public void adjustTokenSumAndRefreshTime(int updateTokenCount, int plusHour) {
        if (isHaveToUpdateNextTokenRefreshTime()){
            //updateNextTokenRefreshTime하고
            // 토큰 업데이트 해주기
            updateNextTokenRefreshTime(plusHour);
            updateTokenSum(updateTokenCount);
        }
    }
    
    //갱신을 해야하는지 여부 검사
    private boolean isHaveToUpdateNextTokenRefreshTime(){
        //최초인 경우
        if (nextTokenRefreshTime == null) {
            return true;
        }
        // 현재 날짜/시간
        LocalDateTime now = LocalDateTime.now();
        if (now.isAfter(nextTokenRefreshTime)) {
            System.out.println("have to update");
            return true;
        } else {
            System.out.println("not have to update..");
            return false;
        }
    }

    //현 시간의 "plusHour"시간 이후로 저장
    private void updateNextTokenRefreshTime(int plusHour) {
        // 현재 날짜/시간
         LocalDateTime now = LocalDateTime.now();
        // 현재 날짜/시간 출력
//         System.out.println(now); // 2021-06-17T06:43:21.419878100
        // 포맷팅
//         String formatedNow = now.format(DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 HH시 mm분 ss초"));
         String formatedNow = now.format(DateTimeFormatter.ofPattern("HH:mm"));
         // 포맷팅 현재 날짜/시간 출력
//         System.out.println(formatedNow);  // 2021년 06월 17일 06시 43분 21초


        //시간 더하기
        LocalDateTime refreshTime = now.plusHours(plusHour);
//        LocalDateTime refreshTime = now.plusSeconds(20);

        System.out.println("refreshTime: " + refreshTime);
        nextTokenRefreshTime = refreshTime;
    }

    public String toStringNextTokenRefreshTime(){
        if (Integer.parseInt(nextTokenRefreshTime.format(DateTimeFormatter.ofPattern("HH"))) > 12) {
            //오후
            return "PM "+nextTokenRefreshTime.format(DateTimeFormatter.ofPattern("HH:mm"));
        } else {
            //오전
            return "AM "+nextTokenRefreshTime.format(DateTimeFormatter.ofPattern("HH:mm"));

        }
    }


}