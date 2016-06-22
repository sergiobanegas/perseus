package org.kurento.perseus.message;


import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.validation.Valid;

import org.kurento.perseus.room.RoomRepository;
import org.kurento.perseus.team.TeamRepository;
import org.kurento.perseus.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/chatmessages")
public class ChatMessageRestController {

	@Autowired
	private ChatMessageRepository ChatMessageRepository;
	@Autowired
	private RoomRepository roomRepository;
	@Autowired
	private TeamRepository teamRepository;
	@Autowired
	private UserRepository userRepository;
	
	@RequestMapping(method = RequestMethod.GET)
	public List<ChatMessage> allChatMessages(Model model) {
		return ChatMessageRepository.findAll();
	}

	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<ChatMessage> addChatMessage(@RequestBody ChatMessage chatMessage) {	
		if (chatMessage.getRoomid()!=0){
			chatMessage.setRoom(roomRepository.findOne(chatMessage.getRoomid()));
		}
		chatMessage.setUser(userRepository.findOne(chatMessage.getUserid()));
		chatMessage.setTeam(teamRepository.findOne(chatMessage.getTeamid()));
		ChatMessageRepository.save(chatMessage);		
		return new ResponseEntity<>(chatMessage,HttpStatus.CREATED);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void deleteItem(@PathVariable Integer id) {
		ChatMessage message=ChatMessageRepository.findOne(id);
		message.setRoom(null);
		message.setTeam(null);
		message.setUser(null);
		ChatMessageRepository.delete(id);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public ChatMessage getChatMessage(@PathVariable int id) {
		return ChatMessageRepository.findOne(id);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public ChatMessage updateChatMessage(@PathVariable int id, @RequestBody @Valid ChatMessage chatMessage) {
		Date date= new Date();
		SimpleDateFormat sdf= new SimpleDateFormat("yyyy-MM-dd HH:mm");
		chatMessage.setDate(sdf.format(date));	
		return ChatMessageRepository.save(chatMessage);
	}
}