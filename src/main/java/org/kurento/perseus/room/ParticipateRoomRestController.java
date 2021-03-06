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
@RequestMapping("/participaterooms")
public class ParticipateRoomRestController {

	@Autowired
	private ParticipateRoomRepository participateRoomRepository;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private TeamRepository teamRepository;
	@Autowired
	private RoomRepository roomRepository;
	
	@RequestMapping(method = RequestMethod.GET)
	public List<ParticipateRoom> allParticipates(Model model) {
		return participateRoomRepository.findAll();
	}

	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<ParticipateRoom> addParticipate(@RequestBody ParticipateRoom participate) {
		participate.setRoom(roomRepository.findOne(participate.getRoomid()));
		participate.setTeam(teamRepository.findOne(participate.getTeamid()));
		participate.setUser(userRepository.findOne(participate.getUserid()));
		participateRoomRepository.save(participate);		
		return new ResponseEntity<>(participate,HttpStatus.CREATED);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void deleteItem(@PathVariable Integer id) {
		ParticipateRoom participates= participateRoomRepository.findOne(id);
		participates.setRoom(null);
		participates.setTeam(null);
		participates.setUser(null);
		participateRoomRepository.delete(id);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public ParticipateRoom getParticipate(@PathVariable int id) {
		return participateRoomRepository.findOne(id);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public ParticipateRoom updateParticipate(@PathVariable int id, @RequestBody @Valid ParticipateRoom participate) {
		return participateRoomRepository.save(participate);
	}
	
	@RequestMapping(value = "/room/{id}", method = RequestMethod.PUT)
	public List<ParticipateRoom> findParticipateRoomByRoom(@PathVariable Integer room) {
		return participateRoomRepository.findByRoomid(room);
	}
	
	@RequestMapping(value = "/{user}/{room}", method = RequestMethod.GET)
	public List<ParticipateRoom> getParticipateRoom(@PathVariable Integer user, @PathVariable Integer room) {
		return participateRoomRepository.findByUseridAndRoomid(user, room);
	}
}