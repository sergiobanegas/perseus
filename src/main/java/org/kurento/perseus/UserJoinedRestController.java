package org.kurento.perseus;


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
@RequestMapping("/senduserjoined")
public class UserJoinedRestController {

	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<String> sendJoinInfo(@RequestBody String data) throws UnsupportedEncodingException, JSONException {
		JSONObject json=new JSONObject(data);
		String userName=(String)((JSONObject)json.get("user")).get("name");
		String email=(String)((JSONObject)json.get("user")).get("email");
		String teamName=(String)((JSONObject)json.get("team")).get("name");	
		Integer response=(Integer)json.get("response");
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
			message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));			
			String text;
			if (response==1){
				message.setSubject("You are now a member of "+teamName);
				text="Congratulations "+userName+"!.<\br> Now you are a member of the team <b>"+teamName+"</b>, you can enter now the team from the main page.";
			}else{
				message.setSubject("Petition to join "+teamName+" denied");
				text="Sorry "+userName+".<\br> The administrative staff of the team <b>"+teamName+"</b> denied your petition to enter the team.";
			}
			//Y por ultimo el texto.
			message.setContent(text, "text/html; charset=utf-8");
			//Esta orden envía el mensaje
			Transport.send(message);
			//Con esta imprimimos en consola que el mensaje fue enviado
			System.out.println("Message about new member sent to the user "+userName+" - "+email);
			}catch (MessagingException e) {
				//Si existiera un error en el envío lo hacemos saber al cliente y lanzamos una excepcion.
				System.out.println("Error sending a 'user joined' message.");
				throw new RuntimeException(e);
			}
		return new ResponseEntity<>(email,HttpStatus.CREATED);
	}
}