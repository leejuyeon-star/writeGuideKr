package writeguidekrGroup.writeguidekr.repository;

import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.stereotype.Repository;
import writeguidekrGroup.writeguidekr.domain.entity.User;

import java.util.Optional;

//public interface UserRepository extends JpaRepository<User, Long> {
//    boolean existsByLoginId(String loginId);
//    Optional<User> findByLoginId(String loginId);
//    Optional<User> findByNickname(String nickname);
//    Optional<User> findById(Long id);
//}
//@EnableWebMvc
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
//public interface UserRepository {
    boolean existsByLoginId(String loginId);
    boolean existsByNickname(String nickname);
    Optional<User> findByLoginId(String loginId);
}

