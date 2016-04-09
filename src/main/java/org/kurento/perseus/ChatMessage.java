package org.kurento.perseus;


import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
public class ChatMessage {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	private Integer userid;
	@ManyToOne
	private User user;
	private Integer teamid;
	@ManyToOne
	private Team team;
	private Integer roomid;
	@ManyToOne
	private Room room;
	private String text;
	private String date;	
	public ChatMessage() {
		// TODO Auto-generated constructor stub
	}
	

	public String getText() {
		return text;
	}
	
	public String getDate() {
		return date;
	}

	public Integer getRoomid() {
		return roomid;
	}
	
	public Integer getTeamid() {
		return teamid;
	}
	
	public Integer getUserid() {
		return userid;
	}
	
	public Integer getId() {
		return id;
	}
	
	public Room getRoom() {
		return room;
	}
	
	public Team getTeam() {
		return team;
	}
	
	public User getUser() {
		return user;
	}

	public void setText(String text) {
		this.text = text;
	}
	
	public void setDate(String date) {
		this.date = date;
	}
	
	public void setRoomid(Integer roomid) {
		this.roomid = roomid;
	}
	
	public void setTeamid(Integer teamid) {
		this.teamid = teamid;
	}
	
	public void setUserid(Integer userid) {
		this.userid = userid;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	public void setRoom(Room room) {
		this.room = room;
	}
	
	public void setUser(User user) {
		this.user = user;
	}
	
	public void setTeam(Team team) {
		this.team = team;
	}

}