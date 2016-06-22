package org.kurento.perseus.room;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, Integer> {
	List<Room> findByTeamid(Integer team);
	List<Room> findByNameAndTeamid(String name, Integer team);
	List<Room> findByCreatorid(Integer user);
}