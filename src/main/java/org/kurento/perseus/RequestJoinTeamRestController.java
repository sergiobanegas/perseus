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
@RequestMapping("/requestjointeams")
public class RequestJoinTeamRestController {

	@Autowired
	private RequestJoinTeamRepository requestJoinTeamRepository;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private TeamRepository teamRepository;
	
	@RequestMapping(method = RequestMethod.GET)
	public List<RequestJoinTeam> allRequestJoinTeams(Model model) {
		return requestJoinTeamRepository.findAll();
	}

	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<RequestJoinTeam> addUser(@RequestBody RequestJoinTeam request) {
		request.setTeam(teamRepository.findOne(request.getTeamid()));
		request.setUser(userRepository.findOne(request.getUserid()));
		requestJoinTeamRepository.save(request);		
		return new ResponseEntity<>(request,HttpStatus.CREATED);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void deleteItem(@PathVariable Integer id) {
		requestJoinTeamRepository.delete(id);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public RequestJoinTeam getRequestJoinTeam(@PathVariable int id) {
		return requestJoinTeamRepository.findOne(id);
	}
	
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public RequestJoinTeam updateRequestJoinTeam(@PathVariable int id, @RequestBody @Valid RequestJoinTeam request) {
		return requestJoinTeamRepository.save(request);
	}
	
}