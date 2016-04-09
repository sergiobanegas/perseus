package org.kurento.perseus;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Integer> {
	List<ChatMessage> findByRoomid(Integer room);
	List<ChatMessage> findByTeamid(Integer team);
	List<ChatMessage> findByUserid(Integer user);
}