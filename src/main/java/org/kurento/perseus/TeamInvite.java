package org.kurento.perseus;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class TeamInvite {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	private Integer user;
	private Integer team;
		
	public TeamInvite() {
		// TODO Auto-generated constructor stub
	}
	
	public Integer getId() {
		return id;
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
	
	public void setUser(Integer user) {
		this.user = user;
	}
	
	public void setTeam(Integer team) {
		this.team = team;
	}

}