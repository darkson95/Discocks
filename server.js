var Discord = require("discord.js");
var bot = new Discord.Client();
var kieling = new Discord.Client();
var flussbachenbestandskontroloer = new Discord.Client();
var lahnsteiner = new Discord.Client();
var request = require('request');
var stringArgv = require('string-argv');
var request = require('request');
var parseString = require('xml2js').parseString;
var stringSimilarity = require('string-similarity');
var querystring = require('querystring');
var humanizeDuration = require('humanize-duration')

var tttier = [];
var gioghurt = false;
var counter = 0;

bot.login(process.env.DBOTTOKEN);
kieling.login(process.env.KIELINGTOKEN);
flussbachenbestandskontroloer.login(process.env.FLUSSBACHENBESTANDSKONTROLOERTOKEN);
lahnsteiner.login(process.env.LAHNSTEINERTOKEN);

bot.on('ready', () => {
	var game = new Discord.Game({name : "!info", type : 1});
	var pres = new Discord.Presence({status : "online", game : game});

	bot.user.setPresence(pres);

	console.log('I am ready!');
});

kieling.on('ready', () => {
	var game = new Discord.Game({name : "mit Cleo", type : 1});
	var pres = new Discord.Presence({status : "online", game : game});

	kieling.user.setPresence(pres);

	console.log('kieling is ready!');
});

flussbachenbestandskontroloer.on('ready', () => {
	var game = new Discord.Game({name : "Spastkiste", type : 1});
	var pres = new Discord.Presence({status : "online", game : game});

	flussbachenbestandskontroloer.user.setPresence(pres);

	console.log('flussbachenbestandskontroloer is ready!');
});

lahnsteiner.on('ready', () => {
	var game = new Discord.Game({name : "420 blaze it", type : 1});
	var pres = new Discord.Presence({status : "online", game : game});

	lahnsteiner.user.setPresence(pres);

	console.log('lahnsteiner is ready!');
});

bot.on("message", msg => {
	var prefix = "!";
	var args = stringArgv.parseArgsStringToArgv(msg.content);
	var cmd = "";
	if(args != undefined && args.length > 0){
		var cmd = args[0].toLowerCase();
	}
	args = args.filter(a => a !== cmd);

	if(msg.channel.name == "music"){
		if(msg.content.includes("youtu")){
			var match = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/.exec(msg.content);

			if(match != undefined && match.length > 0){
				var id = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i.exec(match[0])
				if(id != undefined && id.length > 0){
					id = id[1];
					
					var req = Youtube.playlistItems.list(
					{
						part: "snippet", 
						playlistId: process.env.YTPLAYLISTID
					}, 
					(err, data) => {
						if (err){
							msg.reply(err);
							return;
						}

						var ids = [];

						data.items.forEach(i => {
							ids.push(i.snippet.resourceId.videoId);
						});

						if(ids.indexOf(id) == -1){
							Youtube.playlistItems.insert({
								part: "snippet",
								resource: {
									snippet: {
										playlistId: process.env.YTPLAYLISTID,
										resourceId: {
											kind: "youtube#video",
											videoId: id
										}
									}
								}
							}, (err, data) => {
								if (err){
									msg.reply(err);
									return;
								}
							});
						}
					});
				}
			}
		}
	}

	if (msg.author.bot) return;
	if (!msg.guild) {
		msg.reply('Please send Message in Guild!');
		return;
	}
	if (!cmd.startsWith(prefix)) return;

	if(cmd.startsWith(prefix + "commands")){
		msg.reply('\n\n**!info** - prints general information\n**!shit *str*** - prints Mario shitting on your *str*\n**!ascii *str*** - prints *str* in Ascii-Art from http://artii.herokuapp.com\n**!yee** - prints yee-dinosaur\n**!coin** - prints tails or heads\n**!meme "*memeName*" ["*topLine*"] ["*bottomLine*"]** - creates Meme on http://memegenerator.net with your options\n**!ttt** - prints question/players and adds you to the playerlist\n**!ttt clear** - clears the playerlist\n**!ttt add [*userName*]** - adds you [or the username] to the playerlist\n**!ttt rm [*userName*]** - removes you [or the username] from the playerlist\n**!insult *username** - insults *username* from http://datahamster.com/autoinsult\n**!compliment *username*** - compliments *username* from http://emergencycompliment.com\n');
	}
	else if(cmd.startsWith(prefix + "info")){
		var ut = humanizeDuration(Math.round(bot.uptime / 1000)*1000);
		msg.reply('\n\nIf you found a bug or have a nice idea, please contact me or create an issue on GitHub!\n- Mail: discocks@wurstkun.com\n- Repository: https://github.com/darkson95/Discocks\n- ``!commands`` - prints all commands\n- Bot-Uptime: ' + ut + '\n- Youtubeplaylist: https://www.youtube.com/playlist?list=' + process.env.YTPLAYLISTID + '\n');
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
				msg.reply('Error: (request-search)' + err);
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
					msg.reply('Error: (request-gen)' + err);
					return;
				}

				if(body.success){
					msg.channel.sendFile(body.result.instanceImageUrl, "Meme.jpg", msg.content + " | " + meme.displayName);
					msg.delete();
				}
				else {
					msg.reply('Error: (body.success)' + JSON.stringify(body, null, 1));
				}
			});
		});
	}
	else if(cmd.startsWith(prefix + "ttt")){
		var func = args[0] || "";
		var name = args[1] || msg.author.username;
		var usr = {name: name, date: Date.now()};

		if(tttier.length > 0){
			var ms = Date.now() - tttier[tttier.length - 1].date;
			if(ms > 28800000){
				tttier = [];
				msg.reply("Liste wurde gecleared, da der letzte Eintrag älter als 8 Stunden ist.");
			}
		}

		msg.delete();
		var msgs = Array.from(msg.channel.messages.values());
		msgs = msgs.filter(x => x.author.username == bot.user.username && x.content.startsWith('Lust'));
		if(msgs.length > 0){
			msgs.forEach(x => x.delete());
		}
		
		tttier = tttier.filter(e => e.name !== name);
		
		if(func == "add"){
			tttier.push(usr);
			msg.channel.sendMessage("Lust auf Trouble in Terrorist Town? Es sind schon " + tttier.length + " Spieler dabei: \n" + printTTTIEREntry(tttier));
		}
		else if(func == "rm"){
			msg.channel.sendMessage("Lust auf Trouble in Terrorist Town? Es sind schon " + tttier.length + " Spieler dabei: \n" + printTTTIEREntry(tttier));
		}
		else if(func == "clear"){
			tttier = [];
		}
		else {
			tttier.push(usr);
			msg.channel.sendMessage("Lust auf Trouble in Terrorist Town? Es sind schon " + tttier.length + " Spieler dabei: \n" + printTTTIEREntry(tttier));
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
			msg.channel.sendMessage(`${bestUser}, ` + insult, {tts: true});
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
	
				msg.channel.sendMessage(`${bestUser}, ` + compliment, {tts: true});
			});
	}
});

function printTTTIEREntry(arr) {
	var str = "";
	arr.forEach(e => {
		var date = new Date(e.date);
		str = str.concat(" - " + e.name + "\n");
	});

	return str;
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

/////////////////////////////////////////////////////////////////////////////////////////////

kieling.on("message", msg => {

	if(msg.content.startsWith("!kieling")){
		gioghurt = true;
		ja(msg.channel);
	}
	else if(msg.content.startsWith("!maggi")){
		gioghurt = false;
	}
	else if(msg.content.startsWith("Die lebt!") && msg.author.username.includes("Flussbachenbestandskontrolör") && gioghurt){
		if(counter < 3){
			setTimeout(function(){
				ja(msg.channel);
			}, 3750);
		}
		else {
			gioghurt = false;
			counter = 0;
		}
	}

});

flussbachenbestandskontroloer.on("message", msg => {

	if(msg.content.startsWith("Ja!") && msg.author.username.includes("Andreas Kieling")){

		setTimeout(function(){
			msg.channel.sendMessage("Die lebt!", {tts: true});
		}, 3000);

	}
});


function ja(channel) {
	channel.sendMessage('Ja!', {tts: true});
	counter++;
}


/////////////////////////////////////////////////



lahnsteiner.on("message", msg => {

	if(msg.content.toUpperCase().startsWith("WIE DER LAHNSTEINER ZU SAGEN PFLEGT")){
		msg.channel.sendMessage("Korrekt!", {tts: true});
	}
});