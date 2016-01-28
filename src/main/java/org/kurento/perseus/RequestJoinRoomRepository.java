package org.kurento.perseus;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestJoinRoomRepository extends JpaRepository<RequestJoinRoom, Integer> {
	List<RequestJoinRoom> findByUserAndRoom(Integer user, Integer room);
}