package org.kurento.perseus;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
	List<User> findByEmail(String email);
}