package org.kurento.perseus;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Integer> {
	List<ChatMessage> findByRoom(Integer room);
	List<ChatMessage> findByTeam(Integer team);
	List<ChatMessage> findByUser(Integer user);
}