package org.kurento.perseus.team;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipateRepository extends JpaRepository<Participate, Integer> {
	List<Participate> findByTeamPrivilegesAndTeamid(Integer teamPrivileges, Integer team);
	List<Participate> findByTeamid(Integer team);
	List<Participate> findByUserid(Integer user);
	List<Participate> findByTeamidAndUserid(Integer team, Integer user);
}