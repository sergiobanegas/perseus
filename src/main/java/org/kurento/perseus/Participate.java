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
	
	private Integer iduser;
	private String userName;
	private Integer idteam;
	private String teamName;
	private Integer teamPrivileges;
	
	private int privileges;
	
	public Participate() {
		// TODO Auto-generated constructor stub
	}
	
	public Integer getId() {
		return id;
	}
	
	public Integer getIduser() {
		return iduser;
	}
	
	public String getUserName() {
		return userName;
	}
	
	public int getPrivileges() {
		return privileges;
	}
	
	public Integer getIdteam() {
		return idteam;
	}
	
	public String getTeamName() {
		return teamName;
	}
	
	public Integer getTeamPrivileges() {
		return teamPrivileges;
	}
	
	public void setIduser(Integer iduser) {
		this.iduser = iduser;
	}
	
	public void setUserName(String userName) {
		this.userName = userName;
	}
	
	public void setPrivileges(int privileges) {
		this.privileges = privileges;
	}
	
	public void setIdteam(Integer idteam) {
		this.idteam = idteam;
	}
	
	public void setTeamName(String teamName) {
		this.teamName = teamName;
	}
	
	public void setTeamPrivileges(Integer teamPrivileges) {
		this.teamPrivileges = teamPrivileges;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}

}