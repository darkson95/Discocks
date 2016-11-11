var Discord = require("discord.js");
var bot = new Discord.Client();
var request = require('request');
var stringArgv = require('string-argv');
var YouTube = require('youtube-node');
var youTube = new YouTube();
youTube.setKey(process.env.YTAPITOKEN);
var ytdl = require('ytdl-core');
var request = require('request');
var parseString = require('xml2js').parseString;
var stringSimilarity = require('string-similarity');
var querystring = require('querystring');
var humanizeDuration = require('humanize-duration')

var tttier = [];
var ytQueue = [];
var ytNowPlaying = "";
var ytCurrentDispatcher = null;

bot.login(process.env.DBOTTOKEN);

bot.on('ready', () => {
	var game = new Discord.Game({name : "!info", type : 1});
	var pres = new Discord.Presence({status : "online", game : game});

	bot.user.setPresence(pres);

	console.log('I am ready!');
});

bot.on("message", msg => {
	var prefix = "!";
	var args = stringArgv.parseArgsStringToArgv(msg.content);
	var cmd = args[0] || "";
	args = args.filter(a => a !== cmd);

	if (msg.author.bot) return;
	if (!msg.content.startsWith(prefix)) return;

	if(msg.content.startsWith(prefix + "commands")){
		msg.reply('\n\n**!info** - prints general information\n**!shit *str*** - prints Mario shitting on your *str*\n**!ascii *str*** - prints *str* in Ascii-Art from http://artii.herokuapp.com\n**!yee** - prints yee-dinosaur\n**!coin** - prints tails or heads\n**!meme "*memeName*" ["*topLine*"] ["*bottomLine*"]** - creates Meme on http://memegenerator.net with your options\n**!ttt** - print question/players and adds you to the playerlist\n**!ttt add [*userName*]** - adds you [or the username] to the playerlist\n**!ttt rm [*userName*]** - removes you [or the username] from the playerlist\n**!yt add *search*** - adds *search* to queue \n**!yt skip** - skips current song\n**!yt plause** - toggles between paused and playing\n**!yt stop** - stops playing and clears queue\n**!yt queue** - prints current queue\n**!yt now** - prints current title\n**!yt vol *value*** - sets music volume (default value: 0.05)\n**!w *YoutubeLink*** - get WatchTogether Link from http://sync-video.com\n**!insult *username** - insults *username* from http://datahamster.com/autoinsult\n**!compliment *username*** - compliments *username* from http://emergencycompliment.com\n');    
	}
	else if(cmd.startsWith(prefix + "info")){
		var ut = humanizeDuration(Math.round(bot.uptime / 1000)*1000);
		msg.reply('\n\nIf you found a bug or have a nice idea, please contact me or create an issue on GitHub!\n- Mail: discocks@wurstkun.com\n- Repository: https://github.com/darkson95/Discocks\n- ``!commands`` - prints all commands\n- Bot-Uptime: ' + ut + '\n');
	}
	else if (cmd.startsWith(prefix + "shit")) {
		var str = "";

		if(args.length == 0){
			str = "deine mudda";
		}
		else if(args.length > 0){
			args.forEach(arg => {
				str = str.concat(arg + ' ');
			});
		}

		str = str.trim();
		var wdh = str.length < 18 ? 18-str.length : 0; 
		msg.channel.sendMessage('``░░░░░░░░░░░░░▄▄▄▄░░░░░░\n░░░░░░░░░░▄▀▀▓▓▓▀█░░░░░\n░░░░░░░░▄▀▓▓▄██████▄░░░\n░░░░░░░▄█▄█▀░░▄░▄░█▀░░░\n░░░░░░▄▀░██▄░░▀░▀░▀▄░░░\n░░░░░░▀▄░░▀░▄█▄▄░░▄█░░░\n░░░░░░░░▀█▄▄░▀▀▀█▀░░░░░\n░░░░░░░░░░█░░░░░█░░░░░░\n░░░░░░▄▀▀▀░░░░░░█▄▄░░░░\n░░░░░░█░█░░░░░░░░░░▐░░░\n░░░░░░▐▐░░░░░░░░░▄░▐░░░\n░░░░░░█░░░░░░░░▄▀▀░▐░░░\n░░░░▄▀░░░░░░░░▐░▄▄▀░░░░\n░░▄▀░░░▐░░░░░█▄▀░▐░░░░░\n░░█░░░▐░░░░░░░░▄░█░░░░░\n░░░█▄░░▀▄░░░░▄▀▐░█░░░░░\n░░░█▐▀▀▀░▀▀▀▀░░▐░█░░░░░\n░░▐█▐░░░▀░░░░░░▐░█▄▄░░░\n░░▀▀░░▄▄▄▄▄░░░░▐▄▄▄▀░░░\n░░░ ' + str + ' ' + '░'.repeat(wdh) + '``');
	} 
	else if (cmd.startsWith(prefix + "yee")) {
		msg.channel.sendMessage('\n░░░░░░░░░▄▄▄██▀▀▀▀███▄░░░░░\n░░░░░░░▄▀▀░░░░░░░░░░░▀█░░░░\n░░░░▄▄▀░░░░░░░░░░░░░░░▀█░░░\n░░░█░░░░░▀▄░░▄▀░░░░░░░░█░░░\n░░░▐██▄░░▀▄▀▀▄▀░░▄██▀░▐▌░░░\n░░░█▀█░▀░░░▀▀░░░▀░█▀░░▐▌░░░\n░░░█░░▀▐░░░░░░░░▌▀░░░░░█░░░\n░░░█░░░░░░░░░░░░░░░░░░░█░░░\n░░░░█░░▀▄░░░░▄▀░░░░░░░░█░░░\n░░░░█░░░░░░░░░░░▄▄░░░░█░░░░\n░░░░░█▀██▀▀▀▀██▀░░░░░░█░░░░\n░░░░░█░░▀████▀░░░░░░░█░░░░░\n░░░░░░█░░░░░░░░░░░░▄█░░░░░░\n░░░░░░░██░░░░░█▄▄▀▀░█░░░░░░\n░░░░░░░░▀▀█▀▀▀▀░░░░░░█░░░░░\n░░░░░░░░░█░░░░░░░░░░░░█░░░░\n');
	} 
	else if (cmd.startsWith(prefix + "ascii")) {
		var search = "";

		if(args.length == 0){
			search = "deine mudda";
		}
		else if(args.length >= 1){
			args.forEach(arg => {
				search = search.concat(arg + '+');
			});
			search = search.substring(0, search.length - 1);
		}

		request({
			url: "http://artii.herokuapp.com/make?text=" + search,
			headers: {
					'User-Agent': 'GrosserSchwarzerDildo/5.0 (Bitch) SuckMy/12.0 Inch'
				}
			}, function (errorTwo, responseTwo, bodyTwo) {
			if (!errorTwo && responseTwo.statusCode == 200) {
				msg.channel.sendMessage('``' + bodyTwo + '``');
			}
		});
	} 
	else if (cmd.startsWith(prefix + "coin")) {
		var int = Math.floor((Math.random() * 2));

		switch(int){
			case 0:
				msg.reply("Tails");
				break;
			case 1:
				msg.reply("Heads");
				break;
			default:
				break;
		}
	}
	else if(cmd.startsWith(prefix + "meme")){
		var searchRaw = args[0];
		var search = searchRaw.replace(" ", "+");
		var text0 = args[1] || " ";
		var text1 = args[2] || " ";
		text0 = text0.split('&')[0] || " ";
		text1 = text1.split('&')[0] || " ";
		text0 = text0.replace(/(^\"|\"$)/g, "").replace('ä', 'ae').replace('ö', 'oe').replace('ü', 'ue');
		text1 = text1.replace(/(^\"|\"$)/g, "").replace('ä', 'ae').replace('ö', 'oe').replace('ü', 'ue');

		if(search.length == 0){
			msg.reply('Error: SearchString is null');
			return;
		}

		request({
			url: 'http://version1.api.memegenerator.net/Generators_Search?q=' + search,
			json: true,
		}, function(err, res, body) {
			if(err){
				msg.reply('Error: ' + err);
				return;
			}
			else if(body.result.length == 0){
				msg.reply('Error: no results for: ' + searchRaw);
				msg.delete();
				return;
			}

			var meme = body.result[0];

			var imageID = meme.imageUrl.replace(/^.*[\\\/]/, '').split('.');
			imageID = imageID[0];

			var url = "http://version1.api.memegenerator.net/Instance_Create?";
			var paras = querystring.stringify({ username: process.env.MEMEUN, password: process.env.MEMEPW, languageCode: 'de', imageID: imageID, generatorID: meme.generatorID, text0: text0, text1: text1 });
			
			request({
				url: 'http://version1.api.memegenerator.net/Instance_Create?' + paras,
				json: true,
			}, function(err, res, body) {
				if(err){
					msg.reply('Error: ' + err);
					return;
				}

				if(body.success){
					msg.channel.sendFile(body.result.instanceImageUrl, "Meme.jpg", msg.content + " | " + meme.displayName);
					msg.delete();
				}
				else {
					msg.reply('Error: ' + body.error_message);
				}
			});
		});
	}
	else if(cmd.startsWith(prefix + "ttt")){
		var func = args[0] || "";
		var usr = args[1] || msg.author.username;

		if(func == "add"){
			if(tttier.indexOf(usr) == -1){
				tttier.push(usr);
				msg.delete();
				msg.channel.sendMessage("Lust auf Trouble in Terrorist Town? Es sind schon " + tttier.length + " Spieler dabei: \n" + printArray(tttier));
			}
		}
		else if(func == "rm"){
			tttier = tttier.filter(e => e !== usr);
			msg.delete();
			msg.channel.sendMessage("Lust auf Trouble in Terrorist Town? Es sind schon " + tttier.length + " Spieler dabei: \n" + printArray(tttier));
		}
		else if(func == "clear"){
			tttier = [];
			msg.delete();
			msg.channel.sendMessage("TTT-Liste wurde geleert.");
		}
		else {
			if(tttier.indexOf(usr) == -1){
				tttier.push(msg.author.username);
			}
			msg.delete();
			msg.channel.sendMessage("Lust auf Trouble in Terrorist Town? Es sind schon " + tttier.length + " Spieler dabei: \n" + printArray(tttier));
		}
	}
	else if(cmd.startsWith(prefix + "yt")){
		var func = args[0] || "";

		if(func == "add"){
			var search = "";
			if(args.length == 0){
				msg.reply("Error: no Arguments");
				return;
			}
			else if(args.length > 0){
				args.forEach(arg => {
					if(arg != func){
						search = search.concat(arg + ' ');
					}
				});
			}

			youTube.search(search, 2, function(error, result) {
			  	if (error) throw error;

				var videoResult = result.items[0];
				var videoURL = "https://youtube.com/watch?v=" + videoResult.id.videoId;

				ytQueue.push({title : videoResult.snippet.title, url : videoURL});
				msg.channel.sendMessage(videoResult.snippet.title + " wurde in die Warteschlange von " + msg.author + " hinzugefügt");
			});

			if(bot.voiceConnections.first() == undefined){
				startStream(msg);
			}
		}
		else if(func == "skip"){
			ytCurrentDispatcher.end();
			msg.channel.sendMessage("Aktueller Titel wurde von " + msg.author + " übersprungen.");
		}
		else if(func == "plause"){
			if(ytCurrentDispatcher == null) return;
			if(ytCurrentDispatcher.paused){
				ytCurrentDispatcher.resume();
 				msg.channel.sendMessage("Musikwiedergabe wurde von " + msg.author + " fortgesetzt.");
			}
			else {
				ytCurrentDispatcher.pause();
 				msg.channel.sendMessage("Musikwiedergabe wurde von " + msg.author + " pausiert.");
			}
		}
		else if(func == "stop"){
 			var con = bot.voiceConnections.first();

 			if(con){
 				con.disconnect();
 				msg.channel.sendMessage("Musikwiedergabe wurde von " + msg.author + " gestoppt.");
 			}
		}
		else if(func == "queue"){
			if(ytQueue.length > 0){
				msg.channel.sendMessage("Die Warteschlange: \n" + printQueue(ytQueue));
			}
			else {
				msg.channel.sendMessage("Die Warteschlange ist leer.");
			}
		}
		else if(func == "now"){
			msg.channel.sendMessage("Aktuelle Wiedergabe: " + ytNowPlaying);
		}
		else if(func == "vol"){
			var vol = args[1];

			if(bot.voiceConnections.first() != undefined){
				ytCurrentDispatcher.setVolume(vol);
				msg.channel.sendMessage("Lautstärke wurde auf " + vol + " von " + msg.author + " gesetzt.");
			}
		}
	}
	else if(cmd.startsWith(prefix + "w")){
		var ytUrl = args[0];
		var match = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/.exec(ytUrl);

		var ytId = (match&&match[7].length==11)? match[7] : false;

		if(ytId){
			msg.channel.sendMessage("https://sync-youtube.com/watch?v=" + ytId);
			msg.delete();
		}
		else {
			msg.reply("ERROR: no video id");
		}
	}
	else if(cmd.startsWith(prefix + "insult")){
		var user = args[0] || "Gioghurt";
		var allUsersString = [];
		var allUsers = {};

		Array.from(msg.guild.members.array()).forEach(x => {
			allUsersString.push(x.user.username);
			allUsers[x.user.username] = x.user;
		});

		var best = stringSimilarity.findBestMatch(user, allUsersString);
		var bestUser = allUsers[best.bestMatch.target];
		var int = Math.floor((Math.random() * 4));

		xmlToJson("http://datahamster.com/autoinsult/scripts/webinsult.server.php?xajax=generate_insult&xajaxargs[]=" + int, (err, data) => {
			var insult = data.xjx.cmd[0]._;
			msg.channel.sendMessage(`${bestUser}, ` + insult);
		});
	}
	else if(cmd.startsWith(prefix + "compliment")){
		var user = args[0] || "Gioghurt";
		var allUsersString = [];
		var allUsers = {};

		Array.from(msg.guild.members.array()).forEach(x => {
			allUsersString.push(x.user.username);
			allUsers[x.user.username] = x.user;
		});

		var best = stringSimilarity.findBestMatch(user, allUsersString);
		var bestUser = allUsers[best.bestMatch.target];
		
		request({
				url: 'https://spreadsheets.google.com/feeds/list/1eEa2ra2yHBXVZ_ctH4J15tFSGEu-VTSunsrvaCAV598/od6/public/values?alt=json',
				json: true
			}, function(err, res, body) {
				if(err){
					msg.reply('Error: ' + err);
					return;
				}

				var compliments = body.feed.entry;

				var int = Math.floor((Math.random() * compliments.length));
				var compliment = body.feed.entry[int].title.$t;
	
				msg.channel.sendMessage(`${bestUser}, ` + compliment);
			});
	}
});

function printArray(arr) {
	var str = "";
	arr.forEach(e => {
		str = str.concat(" - " + JSON.stringify(e) + "\n");
	});

	return str;
}

function printQueue(queue) {
	var str = "";
	queue.forEach(e => {
		str = str.concat(" - " + e.title + "\n");
	});

	return str;
}

function playStream(connection, msg) {
	var vid = ytQueue[0];

	if(vid){
		ytQueue = ytQueue.filter(e => e !== vid);

		var streamOptions = { seek: 0, volume: 0.05 };
		var stream = ytdl(vid.url, {filter : 'audioonly'});
		ytCurrentDispatcher = connection.playStream(stream, streamOptions);

		msg.reply("Aktuelle Wiedergabe: " + vid.title);
		ytNowPlaying = vid.title;

		ytCurrentDispatcher.on('end', () => {
			if(ytQueue.length != 0){
				playStream(connection, msg);
			}
		});
	}
	else {
		msg.reply('Error: no title in queue');
	}
}

function startStream(msg) {
	for (var channel of msg.channel.guild.channels) {
		if(channel[1].name == "General" && channel[1].type == "voice"){
			channel[1]
				.join()
				.then(connection => {
					playStream(connection, msg);
			 	})
				.catch(console.error);
			break;
		}
	}
}

function xmlToJson(url, callback) {
	request({
		url: url,
		headers: {
				'User-Agent': 'GrosserSchwarzerDildo/5.0 (Bitch) SuckMy/12.0 Inch'
			}
		}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			parseString(body, function(err, result) {
				callback(null, result);
			});
		}
		else{
			throw error;
		}
	});
}
