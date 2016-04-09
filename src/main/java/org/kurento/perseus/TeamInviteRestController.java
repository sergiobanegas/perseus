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
@RequestMapping("/teaminvites")
public class TeamInviteRestController {

	@Autowired
	private TeamInviteRepository teamInviteRepository;

	@RequestMapping(method = RequestMethod.GET)
	public List<TeamInvite> allTeamInvites(Model model) {
		return teamInviteRepository.findAll();
	}

	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<TeamInvite> addTeamInvite(@RequestBody TeamInvite teamInvite) {
		teamInviteRepository.save(teamInvite);
		return new ResponseEntity<TeamInvite>(teamInvite,HttpStatus.CREATED);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void deleteItem(@PathVariable Integer id) {
		teamInviteRepository.delete(id);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public TeamInvite getTeamInvite(@PathVariable int id) {
		return teamInviteRepository.findOne(id);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public TeamInvite updateTeamInvite(@PathVariable int id, @RequestBody @Valid TeamInvite teamInvite) {
		return teamInviteRepository.save(teamInvite);
	}
	
	@RequestMapping(value = "/name/{user}", method = RequestMethod.GET)
	public List<TeamInvite> getTeamInviteByUser(@PathVariable Integer user) {
		return teamInviteRepository.findByUserid(user);
	}
	
}