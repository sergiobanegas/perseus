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
@RequestMapping("/participates")
public class ParticipateRestController {

	@Autowired
	private ParticipateRepository participateRepository;
	@Autowired
	private ParticipateRoomRepository participateRoomRepository;
	@Autowired
	private RequestJoinRoomRepository requestJoinRoomRepository;
	@Autowired
	private RoomInviteRepository roomInviteRepository;
	@Autowired
	private PrivateMessageRepository privateMessageRepository;

	@RequestMapping(method = RequestMethod.GET)
	public List<Participate> allParticipates(Model model) {
		return participateRepository.findAll();
	}

	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<Participate> addParticipate(@RequestBody Participate participate) {
		participateRepository.save(participate);		
		return new ResponseEntity<>(participate,HttpStatus.CREATED);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void deleteItem(@PathVariable Integer id) {
		Participate participate=participateRepository.findOne(id);
		List<ParticipateRoom> participateRooms=participateRoomRepository.findByTeamAndUser(participate.getTeam(), participate.getUser());
		for (int i=0;i<participateRooms.size();i++){
			participateRoomRepository.delete(participateRooms.get(i).getId());
		}
		List<RequestJoinRoom> requestJoinRooms=requestJoinRoomRepository.findByTeamAndUser(participate.getTeam(), participate.getUser());
		for (int i=0;i<requestJoinRooms.size();i++){
			requestJoinRoomRepository.delete(requestJoinRooms.get(i).getId());
		}	
		List<RoomInvite> roomInvites=roomInviteRepository.findByTeamAndUser(participate.getTeam(), participate.getUser());
		for (int i=0;i<roomInvites.size();i++){
			roomInviteRepository.delete(roomInvites.get(i).getId());
		}
		List<PrivateMessage> privateMessages=privateMessageRepository.findByTeamAndTransmitter(participate.getTeam(), participate.getUser());
		privateMessages.addAll(privateMessageRepository.findByTeamAndReceiver(participate.getTeam(), participate.getUser()));
		for (int i=0;i<privateMessages.size();i++){
			privateMessageRepository.delete(privateMessages.get(i).getId());
		}
		participateRepository.delete(id);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public Participate getParticipate(@PathVariable int id) {
		return participateRepository.findOne(id);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public Participate updateParticipate(@PathVariable int id, @RequestBody @Valid Participate participate) {
		return participateRepository.save(participate);
	}
	
	@RequestMapping(value = "/{team}/privileges", method = RequestMethod.GET)
	public List<Participate> getParticipateRoom(@PathVariable Integer team) {
		return participateRepository.findByTeamPrivilegesAndTeam(1, team);
	}
	
	@RequestMapping(value = "/{team}/members", method = RequestMethod.GET)
	public List<Participate> getTeamMembers(@PathVariable Integer team) {
		return participateRepository.findByTeam(team);
	}
	
	@RequestMapping(value = "/{team}/{user}", method = RequestMethod.GET)
	public List<Participate> getTeamMembers(@PathVariable Integer team, @PathVariable Integer user) {
		return participateRepository.findByTeamAndUser(team, user);
	}
	
	
}