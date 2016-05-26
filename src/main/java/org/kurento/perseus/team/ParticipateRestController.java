package org.kurento.perseus.team;


import java.util.List;

import javax.validation.Valid;

import org.kurento.perseus.message.PrivateMessage;
import org.kurento.perseus.message.PrivateMessageRepository;
import org.kurento.perseus.room.ParticipateRoom;
import org.kurento.perseus.room.ParticipateRoomRepository;
import org.kurento.perseus.room.RequestJoinRoom;
import org.kurento.perseus.room.RequestJoinRoomRepository;
import org.kurento.perseus.room.RoomInvite;
import org.kurento.perseus.room.RoomInviteRepository;
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
	@Autowired
	private TeamRepository teamRepository;
	@Autowired
	private UserRepository userRepository;

	@RequestMapping(method = RequestMethod.GET)
	public List<Participate> allParticipates(Model model) {
		return participateRepository.findAll();
	}

	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<Participate> addParticipate(@RequestBody Participate participate) {
		participate.setTeam(teamRepository.findOne(participate.getTeamid()));
		participate.setUser(userRepository.findOne(participate.getUserid()));
		participateRepository.save(participate);		
		return new ResponseEntity<>(participate,HttpStatus.CREATED);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void deleteItem(@PathVariable Integer id) {
		Participate participate=participateRepository.findOne(id);
		List<ParticipateRoom> participateRooms=participateRoomRepository.findByTeamidAndUserid(participate.getTeamid(), participate.getUserid());
		for (int i=0;i<participateRooms.size();i++){
			participateRoomRepository.delete(participateRooms.get(i).getId());
		}
		List<RequestJoinRoom> requestJoinRooms=requestJoinRoomRepository.findByTeamidAndUserid(participate.getTeamid(), participate.getUserid());
		for (int i=0;i<requestJoinRooms.size();i++){
			requestJoinRoomRepository.delete(requestJoinRooms.get(i).getId());
		}	
		List<RoomInvite> roomInvites=roomInviteRepository.findByTeamidAndUserid(participate.getTeamid(), participate.getUserid());
		for (int i=0;i<roomInvites.size();i++){
			roomInviteRepository.delete(roomInvites.get(i).getId());
		}
		List<PrivateMessage> privateMessages=privateMessageRepository.findByTeamidAndTransmitterid(participate.getTeamid(), participate.getUserid());
		privateMessages.addAll(privateMessageRepository.findByTeamidAndReceiverid(participate.getTeamid(), participate.getUserid()));
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
		return participateRepository.findByTeamPrivilegesAndTeamid(1, team);
	}
	
	@RequestMapping(value = "/{team}/members", method = RequestMethod.GET)
	public List<Participate> getTeamMembers(@PathVariable Integer team) {
		return participateRepository.findByTeamid(team);
	}
	
	@RequestMapping(value = "/{team}/{user}", method = RequestMethod.GET)
	public List<Participate> getTeamMembers(@PathVariable Integer team, @PathVariable Integer user) {
		return participateRepository.findByTeamidAndUserid(team, user);
	}
	
	
}