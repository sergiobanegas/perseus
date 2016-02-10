package org.kurento.perseus;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PrivateMessageRepository extends JpaRepository<PrivateMessage, Integer> {
	List<PrivateMessage> findByTransmitter(Integer user);
	List<PrivateMessage> findByReceiver(Integer user);
	List<PrivateMessage> findByTeam(Integer team);
	List<PrivateMessage> findByTeamAndReceiver(Integer team, Integer receiver);
	List<PrivateMessage> findByTeamAndTransmitter(Integer team, Integer transmitter);
}