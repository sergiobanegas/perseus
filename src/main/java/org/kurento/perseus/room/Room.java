package org.kurento.perseus.room;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import org.kurento.perseus.team.Team;
import org.kurento.perseus.user.User;

@Entity
public class Room {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	private String name;
	@ManyToOne
	private Team team;
	private Integer teamid;
	@ManyToOne
	private User creator;
	private Integer creatorid;
	private int privateRoom;
	
	public Room() {
		// TODO Auto-generated constructor stub
	}
	
	public Integer getId() {
		return id;
	}
	
	public String getName() {
		return name;
	}
	
	public Team getTeam() {
		return team;
	}
	
	public User getCreator() {
		return creator;
	}
	
	public int getPrivateRoom() {
		return privateRoom;
	}
	
	public Integer getCreatorid() {
		return creatorid;
	}
	
	public Integer getTeamid() {
		return teamid;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public void setTeam(Team team) {
		this.team = team;
	}
	
	public void setCreator(User creator) {
		this.creator = creator;
	}
	
	public void setPrivateRoom(int privateRoom) {
		this.privateRoom = privateRoom;
	}

	public void setCreatorid(Integer creatorid) {
		this.creatorid = creatorid;
	}
	
	public void setTeamid(Integer teamid) {
		this.teamid = teamid;
	}
}