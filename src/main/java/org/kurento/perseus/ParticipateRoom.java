package org.kurento.perseus;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class ParticipateRoom {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	private Integer user;
	private Integer room;
	private Integer team;
	
	public ParticipateRoom() {
		// TODO Auto-generated constructor stub
	}
	
	public Integer getId() {
		return id;
	}
	
	public Integer getRoom() {
		return room;
	}
	
	public Integer getUser() {
		return user;
	}
	
	public Integer getTeam() {
		return team;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	public void setRoom(Integer room) {
		this.room = room;
	}
	
	public void setUser(Integer user) {
		this.user = user;
	}
	
	public void setTeam(Integer team) {
		this.team = team;
	}

}