package org.kurento.perseus;




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
	private Integer creator;
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
	
	public int getTeam() {
		return team;
	}
	
	public Integer getCreator() {
		return creator;
	}
	
	public int getPrivateRoom() {
		return privateRoom;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public void setTeam(int team) {
		this.team = team;
	}
	
	public void setCreator(Integer creator) {
		this.creator = creator;
	}
	
	public void setPrivateRoom(int privateRoom) {
		this.privateRoom = privateRoom;
	}

}