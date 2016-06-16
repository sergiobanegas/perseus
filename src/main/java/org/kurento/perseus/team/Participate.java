package org.kurento.perseus.team;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import org.kurento.perseus.user.User;

@Entity
public class Participate {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	private Integer userid;
	@ManyToOne
	private User user;
	private Integer teamid;
	@ManyToOne
	private Team team;
	private Integer teamPrivileges;
		
	public Participate() {
		
	}
	
	public Integer getId() {
		return id;
	}
	
	public Team getTeam() {
		return team;
	}
	
	public User getUser() {
		return user;
	}
	
	public Integer getTeamPrivileges() {
		return teamPrivileges;
	}
	
	public Integer getTeamid() {
		return teamid;
	}
	
	public void setTeam(Team team) {
		this.team = team;
	}
	
	public Integer getUserid() {
		return userid;
	}
	
	public void setUser(User user) {
		this.user = user;
	}
	
	public void setTeamPrivileges(Integer teamPrivileges) {
		this.teamPrivileges = teamPrivileges;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	public void setUserid(Integer userId) {
		this.userid = userId;
	}
	
	public void setTeamid(Integer teamid) {
		this.teamid = teamid;
	}

}