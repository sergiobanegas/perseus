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
@RequestMapping("/teams")
public class TeamRestController {

	@Autowired
	private TeamRepository teamRepository;
	@Autowired
	private RoomRepository roomRepository;
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
	public List<Team> allTeams(Model model) {
		return teamRepository.findAll();
	}

	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<Team> addTeam(@RequestBody Team team) {
		teamRepository.save(team);
		return new ResponseEntity<>(team,HttpStatus.CREATED);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void deleteItem(@PathVariable Integer id) {
		teamRepository.delete(id);
		List<Room> rooms=roomRepository.findByTeam(id);
		for (int i=0;i<rooms.size();i++){
			roomRepository.delete(rooms.get(i).getId());
		}
		List<ParticipateRoom> participateRooms=participateRoomRepository.findByTeam(id);
		for (int i=0;i<participateRooms.size();i++){
			participateRoomRepository.delete(participateRooms.get(i).getId());
		}
		List<RoomInvite> roomInvites=roomInviteRepository.findByTeam(id);
		for (int i=0;i<roomInvites.size();i++){
			roomInviteRepository.delete(roomInvites.get(i).getId());
		}
		List<RequestJoinRoom> requestJoinRooms=requestJoinRoomRepository.findByTeam(id);
		for (int i=0;i<requestJoinRooms.size();i++){
			requestJoinRoomRepository.delete(requestJoinRooms.get(i).getId());
		}
		List<RequestJoinTeam> requestJoinTeams=requestJoinTeamRepository.findByTeam(id);
		for (int i=0;i<requestJoinTeams.size();i++){
			requestJoinTeamRepository.delete(requestJoinTeams.get(i).getId());
		}
		List<ChatMessage> chatMessages=chatMessageRepository.findByTeam(id);
		for (int i=0;i<chatMessages.size();i++){
			chatMessageRepository.delete(chatMessages.get(i).getId());
		}
		List<PrivateMessage> privateMessages=privateMessageRepository.findByTeam(id);
		for (int i=0;i<privateMessages.size();i++){
			privateMessageRepository.delete(privateMessages.get(i).getId());
		}	
		List<Participate> participates=participateRepository.findByTeam(id);
		for (int i=0;i<participates.size();i++){
			participateRepository.delete(participates.get(i).getId());
		}
		
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public Team getTeam(@PathVariable int id) {
		return teamRepository.findOne(id);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public Team updateTeam(@PathVariable int id, @RequestBody @Valid Team team) {
		return teamRepository.save(team);
	}
	
	@RequestMapping(value = "/name/{name}", method = RequestMethod.GET)
	public List<Team> getTeamByName(@PathVariable String name) {
		return teamRepository.findByName(name);
	}
	
}