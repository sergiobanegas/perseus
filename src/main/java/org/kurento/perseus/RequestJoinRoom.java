package org.kurento.perseus;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
public class RequestJoinRoom {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@ManyToOne
	private User user;
	private Integer userid;
	@ManyToOne
	private Room room;
	private Integer roomid;
	@ManyToOne
	private Team team;
	private Integer teamid;
	
	public RequestJoinRoom() {
		// TODO Auto-generated constructor stub
	}
	
	public Integer getId() {
		return id;
	}
	
	public User getUser() {
		return user;
	}
	
	public Room getRoom() {
		return room;
	}
	
	public Team getTeam() {
		return team;
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
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	public void setUser(User user) {
		this.user = user;
	}
	
	public void setRoom(Room room) {
		this.room = room;
	}
	
	public void setTeam(Team team) {
		this.team = team;
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

}