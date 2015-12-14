/*
 * (C) Copyright 2014 Kurento (http://kurento.org/)
 * 
 * All rights reserved. This program and the accompanying materials are made
 * available under the terms of the GNU Lesser General Public License (LGPL)
 * version 2.1 which accompanies this distribution, and is available at
 * http://www.gnu.org/licenses/lgpl-2.1.html
 * 
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */
package org.kurento.perseus;

import static org.kurento.commons.PropertiesManager.getPropertyJson;

import java.util.List;

import org.kurento.commons.ConfigFileManager;
import org.kurento.commons.PropertiesManager;
import org.kurento.jsonrpc.JsonUtils;
import org.kurento.room.KurentoRoomServerApp;
import org.kurento.room.kms.KmsManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;

import com.google.gson.JsonArray;
@ComponentScan
@EnableAutoConfiguration
@Import(KurentoRoomServerApp.class)
public class PerseusApp {

	private static final Logger log = LoggerFactory
			.getLogger(PerseusApp.class);

	private final static String KROOMDEMO_CFG_FILENAME = "kroomdemo.conf.json";

	static {
		ConfigFileManager.loadConfigFile(KROOMDEMO_CFG_FILENAME);
	}

	private final Integer DEMO_KMS_NODE_LIMIT = PropertiesManager.getProperty(
			"demo.kmsLimit", 10);
	private final String DEMO_AUTH_REGEX = PropertiesManager
			.getProperty("demo.authRegex");

	private static ConfigurableApplicationContext context;
	
	@Autowired
	private UserRepository userRepository;
	@Bean
	public User firstUser(){
		User admin = new User();
		if (userRepository.findAll().isEmpty()){
			admin.setName("admin");
			admin.setPassword("1234");
			admin.setPrivileges(1);
			userRepository.save(admin);
		}
		return admin;
	}
	
	@Bean
	public KmsManager kmsManager() {
		JsonArray kmsUris =
				getPropertyJson(KurentoRoomServerApp.KMSS_URIS_PROPERTY,
						KurentoRoomServerApp.KMSS_URIS_DEFAULT, JsonArray.class);
		List<String> kmsWsUris = JsonUtils.toStringList(kmsUris);

		log.info("Configuring Kurento Room Server to use the following kmss: "
				+ kmsWsUris);

		FixedNKmsManager fixedKmsManager =
				new FixedNKmsManager(kmsWsUris, DEMO_KMS_NODE_LIMIT);
		fixedKmsManager.setAuthRegex(DEMO_AUTH_REGEX);
		return fixedKmsManager;
	}

	public static ConfigurableApplicationContext start(String[] args, Object... sources) {

		Object[] newSources = new Object[sources.length + 1];
		newSources[0] = KurentoRoomServerApp.class;
		for (int i = 0; i < sources.length; i++)
			newSources[i + 1] = sources[i];

		SpringApplication application = new SpringApplication(newSources);
		context = application.run();
		return context;
	}
	public static void main(String[] args) throws Exception {
		start(args, PerseusApp.class);
	}

	public static void stop() {
		context.stop();
	}
}
