Perseus
=================

Perseus is a online team collaboration application which offers you the possibility of communicate with your team wherever you are with a simple and intuitive interface. 
Perseus uses [Kurento] for the media transmission, Java and MySQL on back-end and AngularJS on the client-side.

Installation details
---------------


#### Install Kurento Media Server (only on Ubuntu 14.04)
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

#### Install MySQL
Perseus works with a MySQL database in order to save the users
and teams data. You have to install MySQL server:
```
sudo apt-get install mysql-server
```	

####Create the Perseus database
Login to the MySQL server from the command line:
```
mysql -u root -p
```
Create a database called "perseus":
```
create database perseus;
```

#### Option 1: Run the JAR file
#####Download the .jar file
Get it from [here](https://github.com/sergiobanegas/perseus/releases/download/v2.0/perseus-2.0.jar).

#####Download the keystore
Get it from [here](https://github.com/sergiobanegas/perseus/releases/download/v2.0/keystore.jks).

#####Execute the jar file
Put both files on the same folder and execute the jar file with the following command:
```
java -jar perseus-2.0.jar
```

#### Option 2: Compile the project source files
##### Install Bower
```
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install -y nodejs
sudo npm install -g bower
```

##### Install Maven
In order to compile the project, you must have Maven installed in your computer. Type this command to install it:
```
sudo apt-get install maven
```
It take a few minutes, be patient.

##### Download the application
Click on one of the formats below in order to download the application in zip format or tar.gz format:

A) [Zip format](https://github.com/sergiobanegas/perseus/archive/v2.0.zip).

B) [Tar.gz format](https://github.com/sergiobanegas/perseus/archive/v2.0.tar.gz).

Decompress the chosen file in order to run it.

##### Run Perseus
```
cd perseus
mvn compile exec:java
```
You'll have to create the default administrator via command line.

Release notes
---------------
v0.1
* Basic video transfer.
* Hide video.
* Turn off sound streaming.
* Full screen on a video call.
* User system: user registration, update credentials and remove account.
* Create/delete a team.
* Join a team.
* Team privileges.
* Create/delete team rooms.
* Exclusive rooms for users with privileges.
* Chat messages.
* A single administrator.
* Admin panel: remove teams and users.


---------------
v0.2
* New visual framework: Angular Material.
* Desktop notifications.
* Mail notifications.
* Mail confirmation.
* Password recovery.
* Team invitations.
* Team requests.
* Room invitations.
* Room requests.
* Room privileges.
* Chat emoticons.
* Chat mentions.
* Chat messages filters: date, content and author.
* Private messages.
* User/team profile image.
* Team admin panel: change credentials and admin users.

Screenshots
---------------
###Main page
![main2](https://cloud.githubusercontent.com/assets/10667581/11827714/a4b6d0a6-a38e-11e5-9b70-a71729d0b51c.jpg)![main](https://cloud.githubusercontent.com/assets/10667581/11827719/a99379b2-a38e-11e5-8762-3e2099e85518.jpg)
###Login and registration
![login2](https://cloud.githubusercontent.com/assets/10667581/11763460/817c5f3c-a10b-11e5-86d6-9f0fcfb1c165.jpg)	
![register](https://cloud.githubusercontent.com/assets/10667581/11763453/5022980c-a10b-11e5-8af8-8af2eedb2d22.jpg)

###Profile
![profile](https://cloud.githubusercontent.com/assets/10667581/11763445/2f59f8cc-a10b-11e5-9749-17fe4766368d.jpg)

###Create team and join an existing one
![joinateam](https://cloud.githubusercontent.com/assets/10667581/11763550/c1fe4bb6-a10f-11e5-8ea8-cb2b128b4339.jpg)
![newteam](https://cloud.githubusercontent.com/assets/10667581/11763534/fe5093a4-a10e-11e5-9b8f-0998b310a99f.jpg)<br/>

###Team
![team](https://cloud.githubusercontent.com/assets/10667581/11827264/21f88e32-a38b-11e5-9bf7-64b836611111.jpg)
To create a new room, click on the blue top left button.
![newroom](https://cloud.githubusercontent.com/assets/10667581/11763456/6aba20fe-a10b-11e5-902f-25658777f5af.jpg)<br/> 
By clicking on the yellow and red lower left buttons you can exit or delete the team if you have administrator privileges or team privileges.

###Room
![room](https://cloud.githubusercontent.com/assets/10667581/11826872/2be3f128-a388-11e5-8248-3d810a6e9598.jpg)

###Admin panel
![admin2](https://cloud.githubusercontent.com/assets/10667581/11827069/c5dc11f6-a389-11e5-8680-73d1f25fb534.jpg)
![admin1](https://cloud.githubusercontent.com/assets/10667581/11827068/c44d791a-a389-11e5-9a59-4c2cf6c38319.jpg)

Note: you can't remove the default administrator user.
[Kurento]: http://kurento.org 
