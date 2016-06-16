package org.kurento.perseus.message;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import org.kurento.perseus.team.Team;
import org.kurento.perseus.user.User;

@Entity
public class PrivateMessage {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	private Integer transmitterid;
	@ManyToOne
	private User transmitter;
	private Integer receiverid;
	@ManyToOne
	private User receiver;
	private Integer teamid;
	@ManyToOne
	private Team team;
	
	private String text;
	private String date;	
	public PrivateMessage() {

	}
	
	public Integer getId() {
		return id;
	}
	
	public User getReceiver() {
		return receiver;
	}
	
	public User getTransmitter() {
		return transmitter;
	}
	
	public Team getTeam() {
		return team;
	}
	
	public String getText() {
		return text;
	}
	
	public Integer getReceiverid() {
		return receiverid;
	}
	
	public Integer getTeamid() {
		return teamid;
	}
	
	public Integer getTransmitterid() {
		return transmitterid;
	}
	
	public String getDate() {
		return date;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	public void setReceiver(User receiver) {
		this.receiver = receiver;
	}
	
	public void setTransmitter(User transmitter) {
		this.transmitter = transmitter;
	}
	
	public void setTeam(Team team) {
		this.team = team;
	}
	
	public void setText(String text) {
		this.text = text;
	}
	
	public void setDate(String date) {
		this.date = date;
	}

	public void setReceiverid(Integer receiverid) {
		this.receiverid = receiverid;
	}
	
	public void setTeamid(Integer teamid) {
		this.teamid = teamid;
	}
	
	public void setTransmitterid(Integer transmitterid) {
		this.transmitterid = transmitterid;
	}
	
}