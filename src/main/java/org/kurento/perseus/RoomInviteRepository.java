package org.kurento.perseus;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomInviteRepository extends JpaRepository<RoomInvite, Integer> {
	List<RoomInvite> findByUserid(Integer user);
	List<RoomInvite> findByTeamid(Integer team);
	List<RoomInvite> findByTeamidAndUserid(Integer team, Integer user);
}