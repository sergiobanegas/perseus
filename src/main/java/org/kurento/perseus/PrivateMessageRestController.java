package org.kurento.perseus;


import java.text.SimpleDateFormat;
import java.util.Date;
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
@RequestMapping("/privatemessages")
public class PrivateMessageRestController {

	@Autowired
	private PrivateMessageRepository privateMessageRepository;

	@RequestMapping(method = RequestMethod.GET)
	public List<PrivateMessage> allPrivateMessages(Model model) {
		return privateMessageRepository.findAll();
	}

	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<PrivateMessage> addPrivateMessage(@RequestBody PrivateMessage privateMessage) {
		privateMessageRepository.save(privateMessage);		
		return new ResponseEntity<>(privateMessage,HttpStatus.CREATED);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void deleteItem(@PathVariable Integer id) {
		privateMessageRepository.delete(id);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public PrivateMessage getPrivateMessage(@PathVariable int id) {
		return privateMessageRepository.findOne(id);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public PrivateMessage updatePrivateMessage(@PathVariable int id, @RequestBody @Valid PrivateMessage privateMessage) {
		Date date= new Date();
		SimpleDateFormat sdf= new SimpleDateFormat("yyyy-MM-dd HH:mm");
		privateMessage.setDate(sdf.format(date));
		return privateMessageRepository.save(privateMessage);
	}
	
	@RequestMapping(value = "/team/{team}", method = RequestMethod.GET)
	public List<PrivateMessage> getByTeam(@PathVariable Integer team) {
		return privateMessageRepository.findByTeam(team);
	}
}