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
@RequestMapping("/chatmessages")
public class ChatMessageRestController {

	@Autowired
	private ChatMessageRepository ChatMessageRepository;

	@RequestMapping(method = RequestMethod.GET)
	public List<ChatMessage> allChatMessages(Model model) {
		return ChatMessageRepository.findAll();
	}

	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<ChatMessage> addChatMessage(@RequestBody ChatMessage chatMessage) {
		ChatMessageRepository.save(chatMessage);		
		return new ResponseEntity<>(chatMessage,HttpStatus.CREATED);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void deleteItem(@PathVariable Integer id) {
		ChatMessageRepository.delete(id);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public ChatMessage getChatMessage(@PathVariable int id) {
		return ChatMessageRepository.findOne(id);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public ChatMessage updateChatMessage(@PathVariable int id, @RequestBody @Valid ChatMessage chatMessage) {
		return ChatMessageRepository.save(chatMessage);
	}
}