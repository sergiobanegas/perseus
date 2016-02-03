package org.kurento.perseus;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UnconfirmedUserRepository extends JpaRepository<UnconfirmedUser, Integer> {
	List<UnconfirmedUser> findByConfirmationCode(Integer confirmation);
}