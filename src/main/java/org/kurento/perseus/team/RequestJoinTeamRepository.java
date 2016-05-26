package org.kurento.perseus.team;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestJoinTeamRepository extends JpaRepository<RequestJoinTeam, Integer> {
	List<RequestJoinTeam> findByTeamid(Integer team);
	List<RequestJoinTeam> findByUserid(Integer user);
}