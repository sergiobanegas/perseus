package org.kurento.perseus;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/emailvalidation")
public class ConfirmEmail {
	
	@Autowired
	private UnconfirmedUserRepository unconfirmedUserRepository;
	@Autowired
	private UserRepository userRepository;
	
	@RequestMapping(value = "/{code}", method = RequestMethod.GET)
	public void confirmEmail(@PathVariable int code) {
		List<UnconfirmedUser> unconfirmedUser=unconfirmedUserRepository.findByConfirmationCode(code);
		if (!unconfirmedUser.isEmpty()){
			UnconfirmedUser unconfirmed=unconfirmedUser.get(0);
			User newuser=new User();
			newuser.setName(unconfirmed.getName());
			newuser.setPassword(unconfirmed.getPassword());
			newuser.setEmail(unconfirmed.getEmail());
			newuser.setPrivileges(0);
			userRepository.save(newuser);
			unconfirmedUserRepository.delete(unconfirmedUser);
		}
	}
}