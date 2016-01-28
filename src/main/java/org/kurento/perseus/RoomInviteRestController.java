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
@RequestMapping("/roominvites")
public class RoomInviteRestController {

	@Autowired
	private RoomInviteRepository roomInviteRepository;

	@RequestMapping(method = RequestMethod.GET)
	public List<RoomInvite> allRoomInvites(Model model) {
		return roomInviteRepository.findAll();
	}

	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<RoomInvite> addUser(@RequestBody RoomInvite request) {
		roomInviteRepository.save(request);		
		return new ResponseEntity<>(request,HttpStatus.CREATED);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void deleteItem(@PathVariable Integer id) {
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