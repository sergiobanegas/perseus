package org.kurento.room.demo;




import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class ChatMessage {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	private String user;
	private String room;
	private Integer team;
	private String text;
		
	public ChatMessage() {
		// TODO Auto-generated constructor stub
	}
	
	public Integer getId() {
		return id;
	}
	
	public String getRoom() {
		return room;
	}
	
	public Integer getTeam() {
		return team;
	}
	
	public String getUser() {
		return user;
	}
	
	public String getText() {
		return text;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	public void setRoom(String room) {
		this.room = room;
	}
	
	public void setTeam(Integer team) {
		this.team = team;
	}
	
	public void setUser(String user) {
		this.user = user;
	}
	
	public void setText(String text) {
		this.text = text;
	}

}