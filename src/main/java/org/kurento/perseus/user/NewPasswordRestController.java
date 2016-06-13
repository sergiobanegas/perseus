package org.kurento.perseus.user;


import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Properties;
import java.util.UUID;

import org.json.JSONException;
import org.json.JSONObject;

import javax.mail.*;
import javax.mail.internet.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sendnewpassword")
public class NewPasswordRestController {

	@Autowired
	private UserRepository userRepository;
	
	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<String> sendNewPassword(@RequestBody String data) throws UnsupportedEncodingException, JSONException {
		JSONObject json=new JSONObject(data);
		String email=(String)(json.get("email"));
		List<User> users=userRepository.findByEmail(email);
		if (users.size()>0){
			User user=users.get(0);	
		    String generatedString = UUID.randomUUID().toString().replaceAll("-", "");
			user.setPassword(generatedString);
			userRepository.save(user);
			Properties props = new Properties();
			props.put("mail.smtp.auth", "true");
			props.put("mail.smtp.starttls.enable", "true");
			props.put("mail.smtp.host", "smtp.gmail.com");
			props.put("mail.smtp.port", "587");
			Session session = Session.getInstance(props,
					new javax.mail.Authenticator() {
					protected PasswordAuthentication
					getPasswordAuthentication() {
					return new PasswordAuthentication("perseuscontact", "PERSEUS1992");
					}
			});
			
			try {
				Message message = new MimeMessage(session);
				message.setFrom(new InternetAddress("perseuscontact@gmail.com", "Perseus App"));
				message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
				message.setSubject("New password");
				String text="Hello"+user.getName()+"!.<\br> Your new password is :<b>"+generatedString+"</b><br/>You can change the passsword again.";
				message.setContent(text, "text/html; charset=utf-8");
				Transport.send(message);
				System.out.println("Message about new password sent to the user "+user.getEmail()+" - "+email);
				}catch (MessagingException e) {
					System.out.println("Error sending a 'user joined' message.");
					throw new RuntimeException(e);
				}
		}
		return new ResponseEntity<>(email,HttpStatus.CREATED);
	}
}