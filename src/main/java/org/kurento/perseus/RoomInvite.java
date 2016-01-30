package org.kurento.perseus;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class RoomInvite {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	private Integer user;
	private Integer transmitter;
	private Integer team;
	private Integer room;
		
	public RoomInvite() {
		// TODO Auto-generated constructor stub
	}
	
	public Integer getId() {
		return id;
	}
	
	public Integer getUser() {
		return user;
	}
	
	public Integer getRoom() {
		return room;
	}
	
	public Integer getTeam() {
		return team;
	}
	
	public Integer getTransmitter() {
		return transmitter;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	public void setUser(Integer user) {
		this.user = user;
	}
	
	public void setRoom(Integer room) {
		this.room = room;
	}
	
	public void setTeam(Integer team) {
		this.team = team;
	}
	
	public void setTransmitter(Integer transmitter) {
		this.transmitter = transmitter;
	}

}