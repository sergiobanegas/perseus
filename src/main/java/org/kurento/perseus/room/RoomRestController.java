package org.kurento.perseus.room;


import java.util.List;

import javax.validation.Valid;

import org.kurento.perseus.message.ChatMessage;
import org.kurento.perseus.message.ChatMessageRepository;
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
@RequestMapping("/rooms")
public class RoomRestController {

	@Autowired
	private RoomRepository roomRepository;
	@Autowired
	private ParticipateRoomRepository participateRoomRepository;
	@Autowired
	private RequestJoinRoomRepository requestJoinRoomRepository;
	@Autowired
	private RoomInviteRepository roomInviteRepository;
	@Autowired
	private ChatMessageRepository chatMessageRepository;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private TeamRepository teamRepository;
	
	
	@RequestMapping(method = RequestMethod.GET)
	public List<Room> allRooms(Model model) {
		return roomRepository.findAll();
	}

	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<Room> addRoom(@RequestBody Room room) {
		room.setTeam(teamRepository.findOne(room.getTeamid()));
		room.setCreator(userRepository.findOne(room.getCreatorid()));
		roomRepository.save(room);		
		if (room.getPrivateRoom()==1){
			ParticipateRoom newParticipate=new ParticipateRoom();
			newParticipate.setUserid(room.getCreator().getId());
			newParticipate.setRoomid(room.getId());
			newParticipate.setTeamid(room.getTeam().getId());
			newParticipate.setUser(room.getCreator());
			newParticipate.setTeam(room.getTeam());
			newParticipate.setRoom(room);
			newParticipate.setRoomPrivileges(2);
			participateRoomRepository.save(newParticipate);
		}
		return new ResponseEntity<>(room,HttpStatus.CREATED);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void deleteItem(@PathVariable Integer id) {
		List<RoomInvite> roomInvites=roomInviteRepository.findByRoomid(id);
		for (int i=0;i<roomInvites.size();i++){
			roomInviteRepository.delete(roomInvites.get(i).getId());
		}
		List<ParticipateRoom> participateRooms=participateRoomRepository.findByRoomid(id);
		for (int i=0;i<participateRooms.size();i++){
			participateRoomRepository.delete(participateRooms.get(i).getId());
		}
		
		List<RequestJoinRoom> requests=requestJoinRoomRepository.findByRoomid(id);
		
		for (int i=0;i<requests.size();i++){
			requestJoinRoomRepository.delete(requests.get(i).getId());
		}
		
		List<ChatMessage> chatMessages=chatMessageRepository.findByRoomid(id);
		
		for (int i=0;i<chatMessages.size();i++){
			chatMessageRepository.delete(chatMessages.get(i).getId());
		}
		Room room=roomRepository.findOne(id);
		room.setCreator(null);
		room.setTeam(null);
		roomRepository.delete(id);
		
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public Room getRoom(@PathVariable int id) {
		return roomRepository.findOne(id);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public Room updateRoom(@PathVariable int id, @RequestBody @Valid Room room) {
		return roomRepository.save(room);
	}
	
	@RequestMapping(value = "/{team}/{name}", method = RequestMethod.GET)
	public List<Room> getRoomByNameAndTeam(@PathVariable int team, @PathVariable String name) {
		return roomRepository.findByNameAndTeamid(name, team);
	}
}