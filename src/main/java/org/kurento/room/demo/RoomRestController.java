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
@RequestMapping("/rooms")
public class RoomRestController {

	@Autowired
	private RoomRepository roomRepository;

	@RequestMapping(method = RequestMethod.GET)
	public List<Room> allRooms(Model model) {
		return roomRepository.findAll();
	}

	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<Room> addRoom(@RequestBody Room room) {
		roomRepository.save(room);		
		return new ResponseEntity<>(room,HttpStatus.CREATED);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void deleteItem(@PathVariable Integer id) {
		roomRepository.delete(id);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public Room getRoom(@PathVariable int id) {
		return roomRepository.findOne(id);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public Room updateRoom(@PathVariable int id, @RequestBody @Valid Room room) {
		return roomRepository.save(room);
	}
}