package org.kurento.perseus;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipateRepository extends JpaRepository<Participate, Integer> {
	List<Participate> findByTeamPrivilegesAndIdteam(Integer teamPrivileges, Integer idteam);
	List<Participate> findByIdteam(Integer idteam);
}