package org.kurento.perseus;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, Integer> {
	List<Room> findByTeam(int team);
	List<Room> findByNameAndTeam(String name, int team);
}