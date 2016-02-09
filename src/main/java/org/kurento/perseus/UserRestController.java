package org.kurento.perseus;


import java.util.List;

import javax.validation.Valid;

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
@RequestMapping("/users")
public class UserRestController {

	@Autowired
	private UserRepository userRepository;
	@Autowired
	private ParticipateRepository participateRepository;
	@Autowired
	private ParticipateRoomRepository participateRoomRepository;
	@Autowired
	private RoomInviteRepository roomInviteRepository;
	@Autowired
	private RequestJoinTeamRepository requestJoinTeamRepository;
	@Autowired
	private RequestJoinRoomRepository requestJoinRoomRepository;
	@Autowired
	private ChatMessageRepository chatMessageRepository;
	@Autowired
	private PrivateMessageRepository privateMessageRepository;
	
	
	@RequestMapping(method = RequestMethod.GET)
	public List<User> allUsers(Model model) {
		return userRepository.findAll();
	}

	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<User> addUser(@RequestBody User user) {
		userRepository.save(user);		
		return new ResponseEntity<>(user,HttpStatus.CREATED);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void deleteItem(@PathVariable Integer id) {
		userRepository.delete(id);
		List<ParticipateRoom> participateRooms=participateRoomRepository.findByUser(id);
		for (int i=0;i<participateRooms.size();i++){
			participateRoomRepository.delete(participateRooms.get(i).getId());
		}
		List<RoomInvite> roomInvites=roomInviteRepository.findByUser(id);
		for (int i=0;i<roomInvites.size();i++){
			roomInviteRepository.delete(roomInvites.get(i).getId());
		}
		List<RequestJoinRoom> requestJoinRooms=requestJoinRoomRepository.findByUser(id);
		for (int i=0;i<requestJoinRooms.size();i++){
			requestJoinRoomRepository.delete(requestJoinRooms.get(i).getId());
		}
		List<RequestJoinTeam> requestJoinTeams=requestJoinTeamRepository.findByUser(id);
		for (int i=0;i<requestJoinTeams.size();i++){
			requestJoinTeamRepository.delete(requestJoinTeams.get(i).getId());
		}
		List<ChatMessage> chatMessages=chatMessageRepository.findByUser(id);
		for (int i=0;i<chatMessages.size();i++){
			chatMessageRepository.delete(chatMessages.get(i).getId());
		}
		List<PrivateMessage> privateMessages=privateMessageRepository.findByTransmitter(id);
		List<PrivateMessage> privateMessagesAux=privateMessageRepository.findByReceiver(id);
		if (!privateMessagesAux.isEmpty()){
			privateMessages.addAll(privateMessagesAux);
		}
		for (int i=0;i<privateMessages.size();i++){
			privateMessageRepository.delete(privateMessages.get(i).getId());
		}
		List<Participate> participates=participateRepository.findByUser(id);
		for (int i=0;i<participates.size();i++){
			participateRepository.delete(participates.get(i).getId());
		}
		
		
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public User getUser(@PathVariable int id) {
		return userRepository.findOne(id);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public User updateUser(@PathVariable int id, @RequestBody @Valid User user) {
		return userRepository.save(user);
	}
}