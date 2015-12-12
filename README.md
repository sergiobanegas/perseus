Perseus
=================

Perseus is a online team collaboration application which offers you the possibility of communicate with your team wherever you are with a simple and intuitive interface. 
Perseus uses [Kurento] for the media transmission, Java and MySQL on back-end and AngularJS on the client-side.

Installation details
---------------

#### Install Kurento Media Server
In order to install the latest stable Kurento Media Server you have to type the following commands, one at a time and in the same order as listed here:

```
echo "deb http://ubuntu.kurento.org trusty kms6" | sudo tee /etc/apt/sources.list.d/kurento.list
wget -O - http://ubuntu.kurento.org/kurento.gpg.key | sudo apt-key add -
sudo apt-get update
sudo apt-get install kurento-media-server-6.0
```
Now Kurento Media Server is installed and started. To stop it and start it again use the following commands:
```
sudo service kurento-media-server-6.0 start
sudo service kurento-media-server-6.0 stop
```

#### Install Bower
```
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install -y nodejs
sudo npm install -g bower
```

#### Install Maven
In order to compile the project, you must have Maven installed in your computer. Type this command to install it:
```
sudo apt-get install maven
```
It take a few minutes, be patient.

#### Install MySQL
Perseus works with a MySQL database in order to save the users
and teams data. You have to install MySQL server:
```
sudo apt-get install mysql-server
```	
The default user and password of the database is "root" "pass". If you want to change the default MySQL connection, you have to change the credentials in the application.properties file inside the project.

#### Clone the repository
```
git clone https://github.com/sergiobanegas/perseus.git
```

#### Run Perseus
```
cd perseus
git checkout
mvn compile exec:java
```
The administrator user and password is set default as "admin" - "1234". You have to create an user with this credentials to have admin privileges.

#### Release notes
v0.1
* Basic video transfer.
* Hide video.
* Turn off sound streaming.
* Full screen on a video call.
* User system: user registration, update credentials and remove account.
* Create/delete a team.
* Join a team.
* Create/delete team rooms.
* Exclusive rooms for users with privileges.
* Chat messages.
* A single administrator.

#### Screenshots
#####Main page
![login](https://cloud.githubusercontent.com/assets/10667581/11763566/ac7dc892-a110-11e5-852f-74dc3dbeab87.jpg)![main](https://cloud.githubusercontent.com/assets/10667581/11763567/b266419e-a110-11e5-8c58-254a26d73364.jpg)

#####Login and registration
![login2](https://cloud.githubusercontent.com/assets/10667581/11763460/817c5f3c-a10b-11e5-86d6-9f0fcfb1c165.jpg)	
![register](https://cloud.githubusercontent.com/assets/10667581/11763453/5022980c-a10b-11e5-8af8-8af2eedb2d22.jpg)

#####Profile
![profile](https://cloud.githubusercontent.com/assets/10667581/11763445/2f59f8cc-a10b-11e5-9749-17fe4766368d.jpg)

#####Create team and join an existing one
![joinateam](https://cloud.githubusercontent.com/assets/10667581/11763550/c1fe4bb6-a10f-11e5-8ea8-cb2b128b4339.jpg)
![newteam](https://cloud.githubusercontent.com/assets/10667581/11763534/fe5093a4-a10e-11e5-9b8f-0998b310a99f.jpg)<br/>
If you create a team, you have to enter it after (this will be fixed in the next release).

#####Team
![team](https://cloud.githubusercontent.com/assets/10667581/11763428/fbdbb2e8-a109-11e5-894a-e63d5f111dc8.png)
To create a new room, click in the blue top left button.
![newroom](https://cloud.githubusercontent.com/assets/10667581/11763456/6aba20fe-a10b-11e5-902f-25658777f5af.jpg)<br/> 
By clicking the yellow and red lower left buttons you can exit or delete the team if you have the privileges to do it.

#####Room
![room](https://cloud.githubusercontent.com/assets/10667581/11763427/fa8531a8-a109-11e5-8025-29714a2297e1.png)
[Kurento]: http://kurento.org
