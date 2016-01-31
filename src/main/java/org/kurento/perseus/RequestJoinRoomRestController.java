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
@RequestMapping("/requestjoinrooms")
public class RequestJoinRoomRestController {

	@Autowired
	private RequestJoinRoomRepository requestJoinRoomRepository;

	@RequestMapping(method = RequestMethod.GET)
	public List<RequestJoinRoom> allRequestJoinRooms(Model model) {
		return requestJoinRoomRepository.findAll();
	}

	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<RequestJoinRoom> addRequest(@RequestBody RequestJoinRoom request) {
		requestJoinRoomRepository.save(request);		
		return new ResponseEntity<RequestJoinRoom>(request,HttpStatus.CREATED);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void deleteItem(@PathVariable Integer id) {
		requestJoinRoomRepository.delete(id);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public RequestJoinRoom getRequestJoinRoom(@PathVariable int id) {
		return requestJoinRoomRepository.findOne(id);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public RequestJoinRoom updateRequestJoinRoom(@PathVariable int id, @RequestBody @Valid RequestJoinRoom request) {
		return requestJoinRoomRepository.save(request);
	}
	
	@RequestMapping(value = "/{room}/{user}", method = RequestMethod.GET)
	public List<RequestJoinRoom> getRequestJoinRoom(@PathVariable Integer room, @PathVariable Integer user) {
		return requestJoinRoomRepository.findByRoomAndUser(room, user);
	}
}