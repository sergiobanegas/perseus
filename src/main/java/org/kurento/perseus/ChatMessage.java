package org.kurento.perseus;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class ChatMessage {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	private Integer user;
	private Integer room;
	private Integer team;
	private String userName;
	private String text;
	private String date;	
	public ChatMessage() {
		// TODO Auto-generated constructor stub
	}
	
	public Integer getId() {
		return id;
	}
	
	public Integer getRoom() {
		return room;
	}
	
	public Integer getTeam() {
		return team;
	}
	
	public Integer getUser() {
		return user;
	}
	
	public String getText() {
		return text;
	}
	
	public String getDate() {
		return date;
	}
	
	public String getUserName() {
		return userName;
	}
	
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	public void setRoom(Integer room) {
		this.room = room;
	}
	
	public void setTeam(Integer team) {
		this.team = team;
	}
	
	public void setUser(Integer user) {
		this.user = user;
	}
	
	public void setText(String text) {
		this.text = text;
	}
	
	public void setDate(String date) {
		this.date = date;
	}
	
	public void setUserName(String userName) {
		this.userName = userName;
	}

}