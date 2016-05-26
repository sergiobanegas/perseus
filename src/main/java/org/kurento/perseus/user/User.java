package org.kurento.perseus.user;




import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;

@Entity
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	private String name;
	private String password;
	private String email;
	@Lob
	private String image;
	private String imageType;
	private int privileges;
	
	public User() {
		// TODO Auto-generated constructor stub
	}
	
	public Integer getId() {
		return id;
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
	
	public String getImage() {
		return image;
	}
	
	public String getImageType() {
		return imageType;
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
	
	public void setImage(String image) {
		this.image = image;
	}
	
	public void setImageType(String imageType) {
		this.imageType = imageType;
	}

}