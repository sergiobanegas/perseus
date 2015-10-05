package org.kurento.room.demo;


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
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public Team getTeam(@PathVariable int id) {
		return teamRepository.findOne(id);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public Team updateTeam(@PathVariable int id, @RequestBody @Valid Team team) {
		return teamRepository.save(team);
	}
}