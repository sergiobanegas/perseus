package org.kurento.perseus;


import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
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
@RequestMapping("/unconfirmedusers")
public class UnconfirmedUserRestController {

	@Autowired
	private UnconfirmedUserRepository unconfirmedUserRepository;

	@RequestMapping(method = RequestMethod.GET)
	public List<UnconfirmedUser> allUsers(Model model) {
		return unconfirmedUserRepository.findAll();
	}

	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<UnconfirmedUser> addUser(@RequestBody UnconfirmedUser user) throws UnsupportedEncodingException {
		unconfirmedUserRepository.save(user);
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
			//Creamos un nuevo mensaje, y le pasamos nuestra sesión iniciada en el paso anterior.
			Message message = new MimeMessage(session);
			//Seteamos la dirección desde la cual enviaremos el mensaje
			message.setFrom(new InternetAddress("perseuscontact@gmail.com", "Perseus App"));
			//Seteamos el destino de nuestro mensaje
			message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(user.getEmail()));			
			String text;
			message.setSubject("Perseus -  Email confirmation");
			text="Hello "+user.getName()+"!.<\br> To become a member of Perseus, you need to confirm your email</b>"
					+ " click <a href='https://localhost:8443/#/emailvalidation/"+user.getConfirmationCode()+"'>here</a>";
			//Y por ultimo el texto.
			message.setContent(text, "text/html; charset=utf-8");
			//Esta orden envía el mensaje
			Transport.send(message);
			//Con esta imprimimos en consola que el mensaje fue enviado
			System.out.println("Email confirmation set to member "+user.getEmail());
			}catch (MessagingException e) {
				//Si existiera un error en el envío lo hacemos saber al cliente y lanzamos una excepcion.
				System.out.println("Error sending a 'user joined' message.");
				throw new RuntimeException(e);
			}
		return new ResponseEntity<>(user,HttpStatus.CREATED);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void deleteItem(@PathVariable Integer id) {
		unconfirmedUserRepository.delete(id);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public UnconfirmedUser getUser(@PathVariable int id) {
		return unconfirmedUserRepository.findOne(id);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public UnconfirmedUser updateUser(@PathVariable int id, @RequestBody @Valid UnconfirmedUser user) {
		return unconfirmedUserRepository.save(user);
	}
}