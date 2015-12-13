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
}