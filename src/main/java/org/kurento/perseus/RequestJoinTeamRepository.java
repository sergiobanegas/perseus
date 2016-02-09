package org.kurento.perseus;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestJoinTeamRepository extends JpaRepository<RequestJoinTeam, Integer> {
	List<RequestJoinTeam> findByTeam(Integer team);
	List<RequestJoinTeam> findByUser(Integer user);
}