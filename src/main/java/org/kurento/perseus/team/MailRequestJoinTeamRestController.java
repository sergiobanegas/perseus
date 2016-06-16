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
@RequestMapping("/sendrequestjointeam")
public class MailRequestJoinTeamRestController {

	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<String> sendJoinInfo(@RequestBody String data) throws UnsupportedEncodingException, JSONException {
		JSONObject json=new JSONObject(data);
		String userName=(String)((JSONObject)json.get("user")).get("name");
		String adminName=(String)((JSONObject)json.get("admin")).get("name");
		String adminEmail=(String)((JSONObject)json.get("admin")).get("email");
		String teamName=(String)((JSONObject)json.get("team")).get("name");
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
			message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(adminEmail));
			message.setSubject("New request to join your team "+teamName);
			String text="Hello "+adminName+"!.<\br> The user "+userName+" wants to join your team <b>"+teamName+"</b>, enter to your team and press notifications to accept/deny the request.";
			message.setContent(text, "text/html; charset=utf-8");
			Transport.send(message);
			System.out.println("Message about new member sent to the user "+adminName+" - "+adminEmail);
			}catch (MessagingException e) {
				System.out.println("Error sending a 'user joined' message.");
				throw new RuntimeException(e);
			}
		return new ResponseEntity<>(adminEmail,HttpStatus.CREATED);
	}
}