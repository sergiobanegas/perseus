package org.kurento.perseus.team;


import java.util.List;

import javax.validation.Valid;

import org.kurento.perseus.message.ChatMessage;
import org.kurento.perseus.message.ChatMessageRepository;
import org.kurento.perseus.message.PrivateMessage;
import org.kurento.perseus.message.PrivateMessageRepository;
import org.kurento.perseus.room.ParticipateRoom;
import org.kurento.perseus.room.ParticipateRoomRepository;
import org.kurento.perseus.room.RequestJoinRoom;
import org.kurento.perseus.room.RequestJoinRoomRepository;
import org.kurento.perseus.room.Room;
import org.kurento.perseus.room.RoomInvite;
import org.kurento.perseus.room.RoomInviteRepository;
import org.kurento.perseus.room.RoomRepository;
import org.kurento.perseus.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/teams")
public class TeamRestController {

	@Autowired
	private UserRepository userRepository;
	@Autowired
	private TeamRepository teamRepository;
	@Autowired
	private RoomRepository roomRepository;
	@Autowired
	private ParticipateRepository participateRepository;
	@Autowired
	private ParticipateRoomRepository participateRoomRepository;
	@Autowired
	private RoomInviteRepository roomInviteRepository;
	@Autowired
	private RequestJoinTeamRepository requestJoinTeamRepository;
	@Autowired
	private RequestJoinRoomRepository requestJoinRoomRepository;
	@Autowired
	private ChatMessageRepository chatMessageRepository;
	@Autowired
	private PrivateMessageRepository privateMessageRepository;


	@RequestMapping(method = RequestMethod.GET)
	public List<Team> allTeams(Model model) {
		return teamRepository.findAll();
	}

	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<Team> addTeam(@RequestBody Team team) {
		team.setImage("iVBORw0KGgoAAAANSUhEUgAAAL4AAAC+CAMAAAC8qkWvAAAAM1BMVEUyicg9j8pJlcxUm85godBrp9J3rdSCs9aNudiZv9ukxd2wy9+70eHH1+PS3eXe4+fp6elALxDWAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AUREBgFFILBDgAAA5FJREFUeNrt3N1yozAMBeADIcQQg/P+T7szvdmdBAJYsn3UlW7bJl9Ux/hPxst0wPnOd77zne985zvf+c53vvOd73znO9/5zv/N/BjG4SfClGzx4x0fEZIF/roh/xsTN3/GUQyJlR9wLrqVkL/ifIxs/AnXoktM/Dsux0rDX5ATPQm/Q2YEBj7yo2vOv0EUS1t+hDCa8iGPsR0fGjG04o8qfDTiQyvGFvxFjY8G/AGKkarzoRq1+bp63OvyO2V+7uM3jz9BPWryARJ/1l89TPMjwOIHSdPJnL1k8FMhPurw+1L8VIVfSp8zdwSPHnja5qM8f7XN723zS+qvf3mv8kNRPkrzy+ovj5vJ+CjLn23zS+uvth42frDNh/OdT8lPtvnRNj843/nOd753nD5ocL7zOfg3nyxW2kuvv9IQbfNLt56xML8ry0+F+Ymq7ZAtkE/F+Xem5P93e1sl+X0FfiBKPtW29FCFH3mSz3SixDg/VuKX8T9etfiRpOkQHcULFfkrSfJzj6FqDzxzq1hyDwEHhtyzHMHuqvM1/fn1BwzVEy3KD/TKJyTFZ5LCl6V17oWFT0vj3EvLzuTdv7BuVFx117DlKPBlNZfSisu2Ba/ygl2NaukmX1o9ft7J2vnFws/4AEr3ZWjd05Cqdjjq/Ctr53q3TOjeUVJqMaoS/0RFV9R9P/37edJYtK8pzf8Zy73vQHaPIu/jd1PZ49+g3hYyXzGDP2oNWN663LkGP+adnTjzyM64c0hwJOOppe/zXxM5mVcc8X48q4vxU4kh+1P2mpDoIb5iahROYyDCy2Z8qRNPBpDVQFX+A6PCkTAIc589GLupzGdO/d6ZYrOnUuKvnew5ww+6k6il15tPQiVVp6cjk/JSBHT1P7PBnbWz59XlCA0+GsYi5s8t+cdd8gF/QdsQ8gFuP7j1RwMgcOuPxj+g/dqeevxCscNv0Pz3f7iS6L9eegbqhn/Y+0M4Tmv89AV/8r81f1jQ7/eeUNnraZZ+WEj+vh86G4VcfDr93o7YJv/Ox9+ZOsJG8veaD6zot4dudvjdSf7Ayd9cTIWV5G+3ftAO8/P4iVa/1feD/4H7Lf0w0/KxdWrSFB+HfGr9Z/pt8XHA72zzyfUfBzeM8fGVP9Pzl298ev1732ONjy/8YJtvQP+282qOf7PNxy5/McFPe/zRBP+xxwfMtZ7fw4+2+aNtPpxfI2bb/H/3ef8AiUP2Dxz+RQ4AAAAASUVORK5CYII=");
		team.setImageType("image/png");
		team.setAdminUser(userRepository.getOne(team.getAdmin()));
		teamRepository.save(team);
		Participate participate=new Participate();
		participate.setUserid(team.getAdmin());
		participate.setTeamid(team.getId());
		participate.setTeam(team);
		participate.setUser(userRepository.findOne(team.getAdmin()));
		participate.setTeamPrivileges(2);
		participateRepository.save(participate);
		return new ResponseEntity<>(team,HttpStatus.CREATED);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void deleteItem(@PathVariable Integer id) {
		List<Room> rooms=roomRepository.findByTeamid(id);
		for (int i=0;i<rooms.size();i++){
			roomRepository.delete(rooms.get(i).getId());
		}
		List<ParticipateRoom> participateRooms=participateRoomRepository.findByTeamid(id);
		for (int i=0;i<participateRooms.size();i++){
			participateRoomRepository.delete(participateRooms.get(i).getId());
		}
		List<RoomInvite> roomInvites=roomInviteRepository.findByTeamid(id);
		for (int i=0;i<roomInvites.size();i++){
			roomInviteRepository.delete(roomInvites.get(i).getId());
		}
		List<RequestJoinRoom> requestJoinRooms=requestJoinRoomRepository.findByTeamid(id);
		for (int i=0;i<requestJoinRooms.size();i++){
			requestJoinRoomRepository.delete(requestJoinRooms.get(i).getId());
		}
		List<RequestJoinTeam> requestJoinTeams=requestJoinTeamRepository.findByTeamid(id);
		for (int i=0;i<requestJoinTeams.size();i++){
			requestJoinTeamRepository.delete(requestJoinTeams.get(i).getId());
		}
		List<ChatMessage> chatMessages=chatMessageRepository.findByTeamid(id);
		for (int i=0;i<chatMessages.size();i++){
			chatMessageRepository.delete(chatMessages.get(i).getId());
		}
		List<PrivateMessage> privateMessages=privateMessageRepository.findByTeamid(id);
		for (int i=0;i<privateMessages.size();i++){
			privateMessageRepository.delete(privateMessages.get(i).getId());
		}	
		List<Participate> participates=participateRepository.findByTeamid(id);
		for (int i=0;i<participates.size();i++){
			participateRepository.delete(participates.get(i).getId());
		}
		teamRepository.delete(id);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public Team getTeam(@PathVariable int id) {
		return teamRepository.findOne(id);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public Team updateTeam(@PathVariable int id, @RequestBody @Valid Team team) {
		return teamRepository.save(team);
	}
	
	@RequestMapping(value = "/name/{name}", method = RequestMethod.GET)
	public List<Team> getTeamByName(@PathVariable String name) {
		return teamRepository.findByName(name);
	}
	
}