package writeguidekrGroup.writeguidekr.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data       // @ToString + @Getter + @Setter + @RequiredArgsConstructor + @EqualsAndHashCode
@Builder
@AllArgsConstructor
@NoArgsConstructor
//토큰 개수, 토큰시간 갱신, 로그인여부, 이름,
public class AccountDto {
    private String userName;
    private int tokenSum;
    private String nextTokenRefreshTime = null;
    private String provider;    //OAuth 로그인 종류


}
