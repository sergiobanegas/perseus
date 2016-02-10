package org.kurento.perseus;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestJoinRoomRepository extends JpaRepository<RequestJoinRoom, Integer> {
	List<RequestJoinRoom> findByRoom(Integer room);
	List<RequestJoinRoom> findByUser(Integer user);
	List<RequestJoinRoom> findByTeam(Integer team);
	List<RequestJoinRoom> findByRoomAndUser(Integer room, Integer user);
	List<RequestJoinRoom> findByTeamAndUser(Integer team, Integer user);
}