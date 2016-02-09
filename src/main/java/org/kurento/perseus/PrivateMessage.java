package org.kurento.perseus;






import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class PrivateMessage {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	private Integer transmitter;
	private Integer receiver;
	private Integer team;
	private String text;
	private String date;	
	public PrivateMessage() {
		// TODO Auto-generated constructor stub
	}
	
	public Integer getId() {
		return id;
	}
	
	public Integer getReceiver() {
		return receiver;
	}
	
	public Integer getTransmitter() {
		return transmitter;
	}
	
	public Integer getTeam() {
		return team;
	}
	
	public String getText() {
		return text;
	}
	
	public String getDate() {
		return date;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	public void setReceiver(Integer receiver) {
		this.receiver = receiver;
	}
	
	public void setTransmitter(Integer transmitter) {
		this.transmitter = transmitter;
	}
	
	public void setTeam(Integer team) {
		this.team = team;
	}
	
	public void setText(String text) {
		this.text = text;
	}
	
	public void setDate(String date) {
		this.date = date;
	}

}