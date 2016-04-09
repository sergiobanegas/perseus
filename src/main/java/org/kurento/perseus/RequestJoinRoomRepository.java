package org.kurento.perseus;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestJoinRoomRepository extends JpaRepository<RequestJoinRoom, Integer> {
	List<RequestJoinRoom> findByRoomid(Integer room);
	List<RequestJoinRoom> findByUserid(Integer user);
	List<RequestJoinRoom> findByTeamid(Integer team);
	List<RequestJoinRoom> findByRoomidAndUserid(Integer room, Integer user);
	List<RequestJoinRoom> findByTeamidAndUserid(Integer team, Integer user);
}