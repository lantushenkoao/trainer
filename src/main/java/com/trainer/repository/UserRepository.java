package com.trainer.repository;

import com.trainer.model.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigInteger;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query(value = "SELECT exists(select * from users where username = :username and is_deleted=0)",
            nativeQuery = true)
    BigInteger usernameIsUsed(@Param(value = "username") String username);

    @Query(value = "SELECT exists(select * from users where email = :email and is_deleted=0)",
            nativeQuery = true)
    BigInteger emailIsUsed(@Param(value = "email") String email);

    @EntityGraph(value = "User.roles", type = EntityGraph.EntityGraphType.FETCH)
    User findByUsername(String username);

    @EntityGraph(value = "User.roles", type = EntityGraph.EntityGraphType.FETCH)
    User findByEmail(String email);

    @EntityGraph(value = "User.roles", type = EntityGraph.EntityGraphType.FETCH)
    List<User> findAll();
}
