package org.kurento.perseus.room;


import java.util.List;

import javax.validation.Valid;

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
@RequestMapping("/roominvites")
public class RoomInviteRestController {

	@Autowired
	private RoomInviteRepository roomInviteRepository;
	@Autowired
	private TeamRepository teamRepository;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private RoomRepository roomRepository;
	
	
	@RequestMapping(method = RequestMethod.GET)
	public List<RoomInvite> allRoomInvites(Model model) {
		return roomInviteRepository.findAll();
	}

	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<RoomInvite> addUser(@RequestBody RoomInvite request) {
		request.setRoom(roomRepository.findOne(request.getRoomid()));
		request.setTeam(teamRepository.findOne(request.getTeamid()));
		request.setUser(userRepository.findOne(request.getUserid()));
		request.setTransmitter(userRepository.findOne(request.getTransmitterid()));
		roomInviteRepository.save(request);		
		return new ResponseEntity<>(request,HttpStatus.CREATED);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void deleteItem(@PathVariable Integer id) {
		RoomInvite roomInvite= roomInviteRepository.findOne(id);
		roomInvite.setRoom(null);
		roomInvite.setTeam(null);
		roomInvite.setUser(null);
		roomInvite.setTransmitter(null);
		roomInviteRepository.delete(id);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public RoomInvite getRoomInvite(@PathVariable int id) {
		return roomInviteRepository.findOne(id);
	}
	
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public RoomInvite updateRoomInvite(@PathVariable int id, @RequestBody @Valid RoomInvite request) {
		return roomInviteRepository.save(request);
	}
	
}