package writeguidekrGroup.writeguidekr.repository;

import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import writeguidekrGroup.writeguidekr.domain.entity.Member;

import java.util.Optional;

//public interface UserRepository extends JpaRepository<User, Long> {
//    boolean existsByLoginId(String loginId);
//    Optional<User> findByLoginId(String loginId);
//    Optional<User> findByNickname(String nickname);
//    Optional<User> findById(Long id);
//}
//@EnableWebMvc
public interface MemberRepository extends JpaRepository<Member, Long> {
    //public interface UserRepository {
    boolean existsByLoginId(String loginId);
    boolean existsByNickname(String nickname);
    Optional<Member> findByLoginId(String loginId);
}

