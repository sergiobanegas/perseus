package org.kurento.perseus;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
public class ParticipateRoom {

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
	private Integer roomPrivileges;
	
	public ParticipateRoom() {
		// TODO Auto-generated constructor stub
	}
	
	public Integer getId() {
		return id;
	}
	
	public Room getRoom() {
		return room;
	}
	
	public User getUser() {
		return user;
	}
	
	public Team getTeam() {
		return team;
	}
	
	public Integer getRoomPrivileges() {
		return roomPrivileges;
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
	
	public void setRoom(Room room) {
		this.room = room;
	}
	
	public void setUser(User user) {
		this.user = user;
	}
	
	public void setTeam(Team team) {
		this.team = team;
	}
	
	public void setRoomPrivileges(Integer roomPrivileges) {
		this.roomPrivileges = roomPrivileges;
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