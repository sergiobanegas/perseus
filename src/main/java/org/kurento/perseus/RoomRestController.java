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
@RequestMapping("/rooms")
public class RoomRestController {

	@Autowired
	private RoomRepository roomRepository;
	@Autowired
	private ParticipateRoomRepository participateRoomRepository;
	@Autowired
	private RequestJoinRoomRepository requestJoinRoomRepository;
	@Autowired
	private ChatMessageRepository chatMessageRepository;
	
	
	@RequestMapping(method = RequestMethod.GET)
	public List<Room> allRooms(Model model) {
		return roomRepository.findAll();
	}

	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<Room> addRoom(@RequestBody Room room) {
		roomRepository.save(room);		
		if (room.getPrivateRoom()==1){
			ParticipateRoom newParticipate=new ParticipateRoom();
			newParticipate.setUser(room.getCreator());
			newParticipate.setRoom(room.getId());
			newParticipate.setTeam(room.getTeam());
			newParticipate.setRoomPrivileges(2);
			participateRoomRepository.save(newParticipate);
		}
		return new ResponseEntity<>(room,HttpStatus.CREATED);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void deleteItem(@PathVariable Integer id) {
		roomRepository.delete(id);
		List<ParticipateRoom> participateRooms=participateRoomRepository.findByRoom(id);
		for (int i=0;i<participateRooms.size();i++){
			participateRoomRepository.delete(participateRooms.get(i).getId());
		}
		
		List<RequestJoinRoom> requests=requestJoinRoomRepository.findByRoom(id);
		
		for (int i=0;i<requests.size();i++){
			requestJoinRoomRepository.delete(requests.get(i).getId());
		}
		
		List<ChatMessage> chatMessages=chatMessageRepository.findByRoom(id);
		
		for (int i=0;i<chatMessages.size();i++){
			chatMessageRepository.delete(chatMessages.get(i).getId());
		}
		
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
		return roomRepository.findByNameAndTeam(name, team);
	}
}