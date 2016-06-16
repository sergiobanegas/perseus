package org.kurento.perseus.team;


import java.io.UnsupportedEncodingException;
import java.util.Properties;
import org.json.JSONException;
import org.json.JSONObject;
import javax.mail.*;
import javax.mail.internet.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sendinvitation")
public class InvitationRestController {

	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<String> sendInvitation(@RequestBody String data) throws UnsupportedEncodingException, JSONException {
		JSONObject json=new JSONObject(data);
		String email=(String)json.get("email");
		String teamName=(String)((JSONObject)json.get("team")).get("name");
		String teamPassword=(String)((JSONObject)json.get("team")).get("password");
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
			message.setSubject("Team invitation");
			String text="You have a new invitation to join the team <b>"+teamName+"</b>. You can join the team now with the following credentials:"
					+ "<br>Team name: <b>"+teamName+"</b></br>"
							+ "Password: <b>"+teamPassword+"</b>";
			message.setContent(text, "text/html; charset=utf-8");
			Transport.send(message);
			System.out.println("Message sent to "+email);
			}catch (MessagingException e) {
				System.out.println("Error sending the message.");
				throw new RuntimeException(e);
			}
		return new ResponseEntity<>(email,HttpStatus.CREATED);
	}
}