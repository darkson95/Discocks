var config = require("./config.json");

var Discord = require("discord.js");
var bot = new Discord.Client();
var stringArgv = require('string-argv');
var humanizeDuration = require('humanize-duration')
var Youtube = require("youtube-api");
Youtube.authenticate({
	type: "oauth",
	refresh_token: config.youtube.refreshToken,
	client_id: config.youtube.clientId,
	client_secret: config.youtube.clientSecret,
	redirect_url: config.youtube.redirectUrl
});

var playerlist = [];

bot.login(config.token);
bot.on('ready', () => {
	var game = new Discord.Game({name : "!info", type : 1});
	var pres = new Discord.Presence({status : "online", game : game});

	bot.user.setPresence(pres);

	console.log('I am ready!');
});

bot.on("message", msg => {
	if (msg.author.bot) return;
	if (!msg.guild) {
		msg.reply('Please send Message in Guild!');
		return;
	}

	var prefix = "!";
	var args = stringArgv.parseArgsStringToArgv(msg.content);
	var cmd = "";
	if(args != undefined && args.length > 0){
		var cmd = args[0].toLowerCase();
	}
	args = args.filter(a => a !== cmd);

	addYoutubeVideoToPlaylist("music", msg, config.youtube.playlistId);

	if(cmd.startsWith(prefix + "info")){
		var ut = humanizeDuration(Math.round(bot.uptime / 1000)*1000);
		msg.reply("If you found a bug or have a nice idea, please contact me or create an issue on GitHub!\n- Mail: " + config.mail + "\n- Repository: " + config.repo + "\n- Bot-Uptime: " + ut + "\n- Youtube-Playlist: https://www.youtube.com/playlist?list=" + config.youtube.playlistId + "\n- Commands: \n	**!ttt [*username*]** - prints question/players and adds you [or the username] to the playerlist\n	**!ttt rm [*username*]** - removes you [or the username] from the playerlist\n	**!ttt clear** - clears the playerlist\n	**!pin** - copies the last message to #pinned\n	**!pin n** - copies the nth last message from the most recent one to #pinned\n	**!pin ID** - copies the message with ID to #pinned\n\n");
	}
	else if(cmd.startsWith(prefix + "ttt")){
		var func = args[0];
		if(args[1]){
			name = args[1];
		}
		else if(args[0] && args[0] != "rm" && args[0] != "clear"){
			name = args[0];
		}
		else {
			name = msg.author.username;
		}
		var usr = {name: name, date: Date.now()};

		if(playerlist.length > 0){
			var ms = Date.now() - playerlist[playerlist.length - 1].date;
			if(ms > 28800000){
				playerlist = [];
				msg.reply("Playerlist cleared because the last entry was 8 hours ago.");
			}
			else {
				var msgs = Array.from(msg.channel.messages.values());
				msgs = msgs.filter(x => x.author.username == bot.user.username && x.content.startsWith('Do you want to play G'));

				if(msgs.length > 0){
					msgs.forEach(x => x.delete());
				}
			}
		}

		msg.delete();
		playerlist = playerlist.filter(e => e.name !== name);
		
		switch (func) {
			case "rm":
			printPlayerlist(msg, playerlist);
			break;
			case "clear":
			playerlist = [];
			break;
			default:
			playerlist.push(usr);
			printPlayerlist(msg, playerlist);
			break;
		}
	}
	else if(cmd.startsWith(prefix + "pin")){
		if(args[0] && args[0] > 100){
			var msgID = args[0];

			msg.channel.fetchMessage(args[0])
			.then(message => {
				pinMessage(msg, message);
			})
			.catch(err => {
				msg.reply("ERROR: " + err);
			});
		}
		else if(args[0] && args[0] < 100) {
			var steps = parseInt(args[0]) + 1;

			var messages = msg.channel.messages.array();
			var message = messages[messages.length - steps];
			
			pinMessage(msg, message);
		}
		else {
			var messages = msg.channel.messages.array();
			var message = messages[messages.length - 2];
			
			pinMessage(msg, message);
		}
	}
});

function pinMessage (msg, message) {
	var pinned = msg.guild.channels.find("id", config.pinnedID);

	if(pinned && msg && message){
		var attachments = message.attachments.array()
		var content = message.content;

		attachments.forEach(attachment => {
			content = content + "\n" + attachment.url; 
		});

		pinned.sendMessage(content);
	}
	else {
		var output = "";
		
		if(!msg){
			output = output + "msg ";
		}
		if(!message){
			output = output + "message ";
		}
		if(!pinned){
			output = output + "pinned ";
		}
		msg.reply(output + " not found!");
	}
}

function printPlayerlist (msg, playerlist) {
	msg.channel.sendMessage("Do you want to play Garry's Mod - Trouble in Terrorist Town? Playerlist [" + playerlist.length + "]:\n" + printPlayerlistEntries(playerlist));	
}

function printPlayerlistEntries(arr) {
	var str = "";
	arr.forEach(e => {
		var date = new Date(e.date);
		str = str.concat(" - " + e.name + "\n");
	});

	return str;
}

function addYoutubeVideoToPlaylist(channelname, msg, playlistid){
	if(msg.channel.name == channelname){
		if(msg.content.includes("youtu")){
			var match = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/.exec(msg.content);

			if(match != undefined && match.length > 0){
				var id = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i.exec(match[0])
				if(id != undefined && id.length > 0){
					id = id[1];
					
					var req = Youtube.playlistItems.list(
					{
						part: "snippet", 
						playlistId: playlistid
					}, 
					(err, data) => {
						if (err){
							msg.reply("ERROR: Youtube.playListItems.list: " + err + data);
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
										playlistId: playlistid,
										resourceId: {
											kind: "youtube#video",
											videoId: id
										}
									}
								}
							}, (err, data) => {
								if (err){
									msg.reply("Youtube.playlistItems.insert: " + err + data);
									return;
								}
							});
						}
					});
				}
			}
		}
	}
}