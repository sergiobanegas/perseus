package org.kurento.room.demo;




import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Room {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	private String name;
	private int team;
	private int privileges;
	
	public Room() {
		// TODO Auto-generated constructor stub
	}
	
	public Integer getId() {
		return id;
	}
	
	public String getName() {
		return name;
	}
	
	public int getPrivileges() {
		return privileges;
	}
	
	public int getTeam() {
		return team;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public void setPrivileges(int privileges) {
		this.privileges = privileges;
	}
	
	public void setTeam(int team) {
		this.team = team;
	}

}