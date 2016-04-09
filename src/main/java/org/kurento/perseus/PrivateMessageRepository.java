package org.kurento.perseus;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PrivateMessageRepository extends JpaRepository<PrivateMessage, Integer> {
	List<PrivateMessage> findByTransmitterid(Integer user);
	List<PrivateMessage> findByReceiverid(Integer user);
	List<PrivateMessage> findByTeamid(Integer team);
	List<PrivateMessage> findByTeamidAndReceiverid(Integer team, Integer receiver);
	List<PrivateMessage> findByTeamidAndTransmitterid(Integer team, Integer transmitter);
}