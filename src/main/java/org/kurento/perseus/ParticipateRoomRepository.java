package org.kurento.perseus;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipateRoomRepository extends JpaRepository<ParticipateRoom, Integer> {
	List<ParticipateRoom> findByRoomid(Integer room);
	List<ParticipateRoom> findByUserid(Integer user);
	List<ParticipateRoom> findByTeamid(Integer team);
	List<ParticipateRoom> findByUseridAndRoomid(Integer user, Integer room);
	List<ParticipateRoom> findByTeamidAndUserid(Integer team, Integer user);
}