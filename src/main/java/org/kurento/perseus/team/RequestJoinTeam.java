package org.kurento.perseus.team;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import org.kurento.perseus.user.User;

@Entity
public class RequestJoinTeam {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@ManyToOne
	private User user;
	private Integer userid;
	@ManyToOne
	private Team team;
	private Integer teamid;
		
	public RequestJoinTeam() {

	}
	
	public Integer getId() {
		return id;
	}
	
	public User getUser() {
		return user;
	}
	
	public Team getTeam() {
		return team;
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
	
	public void setTeam(Team team) {
		this.team = team;
	}
	
	public void setTeamid(Integer teamid) {
		this.teamid = teamid;
	}
	
	public void setUserid(Integer userid) {
		this.userid = userid;
	}

}