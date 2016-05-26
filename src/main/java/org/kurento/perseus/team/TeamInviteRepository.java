package org.kurento.perseus.team;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamInviteRepository extends JpaRepository<TeamInvite, Integer> {
	List<TeamInvite> findByUserid(Integer user);
}