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

#### Features
#Main page
![login]
![main]

#Login and registration
![login2]		
![register]

#Profile
![profile]

#Create team and join an existing one
![joinateam]
![newteam]
If you create a team, you have to enter it after (this will be fixed in the next release).

#Team
![team]
To create a new room, click in the blue top left button.
![newroom]
By clicking the yellow and red lower left buttons you can exit or delete the team if you have the privileges to do it.

#Room
![room]
[Kurento]: http://kurento.org
