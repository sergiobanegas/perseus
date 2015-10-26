package org.kurento.room.demo;

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
	private Integer idteam;
	
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
	
	public int getPrivileges() {
		return privileges;
	}
	
	public Integer getIdteam() {
		return idteam;
	}
	
	public void setIduser(Integer iduser) {
		this.iduser = iduser;
	}
	
	public void setPrivileges(int privileges) {
		this.privileges = privileges;
	}
	
	public void setIdteam(Integer idteam) {
		this.idteam = idteam;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}

}