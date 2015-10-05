package org.kurento.room.demo;




import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	private String name;
	private String password;
	private String email;
	private String company;
	
	private int privileges;
	
	public User() {
		// TODO Auto-generated constructor stub
	}
	
	public Integer getId() {
		return id;
	}
	
	public String getCompany() {
		return company;
	}
	
	public String getEmail() {
		return email;
	}
	
	public String getName() {
		return name;
	}
	
	public String getPassword() {
		return password;
	}
	
	public int getPrivileges() {
		return privileges;
	}
	
	public void setCompany(String company) {
		this.company = company;
	}
	
	public void setEmail(String email) {
		this.email = email;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public void setPassword(String password) {
		this.password = password;
	}
	
	public void setPrivileges(int privileges) {
		this.privileges = privileges;
	}

}