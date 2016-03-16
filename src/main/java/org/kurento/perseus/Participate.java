package org.kurento.perseus;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Participate {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	private Integer user;
	private Integer team;
	private Integer teamPrivileges;
	private boolean notifications;
		
	public Participate() {
		// TODO Auto-generated constructor stub
	}
	
	public Integer getId() {
		return id;
	}
	
	public Integer getTeam() {
		return team;
	}
	
	public Integer getUser() {
		return user;
	}
	
	public Integer getTeamPrivileges() {
		return teamPrivileges;
	}
	
	public boolean getNotifications() {
		return notifications;
	}
	
	public void setTeam(Integer team) {
		this.team = team;
	}
	
	public void setUser(Integer user) {
		this.user = user;
	}
	
	public void setTeamPrivileges(Integer teamPrivileges) {
		this.teamPrivileges = teamPrivileges;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	public void setNotifications(boolean notifications) {
		this.notifications = notifications;
	}

}