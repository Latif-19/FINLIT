package com.finlit.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

/**
 * The User "repository" — the door to the users table.
 *
 * By extending JpaRepository, Spring Data gives us all the standard database
 * operations for free (save, findById, findAll, delete, count...) — no SQL and
 * no implementation code needed.
 *
 * We only declare the extra lookups we need. Spring reads the method NAME and
 * writes the query for us: `findByEmail` becomes "SELECT * FROM users WHERE
 * email = ?". This is used at login time.
 */
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
