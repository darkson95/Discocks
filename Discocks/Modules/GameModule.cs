using Discocks.Helper;
using Discocks.Models;
using Discord;
using Discord.Commands;
using Discord.Rest;
using Discord.WebSocket;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Discocks.Modules
{
    [Group("Game")]
    [Alias("g")]
    public class GameModule : ModuleBase<SocketCommandContext>
    {
        #region Admin

        [Group("Admin")]
        public class GameAdminModule : ModuleBase<SocketCommandContext>
        {
            #region Get

            [Command("get")]
            [Alias("g")]
            [Summary("prints all games")]
            public async Task Get()
            {
                List<Models.Game> games = await Models.Game.GetGamesAsync();

                await PrintGamesAsync(games);
            }

            #endregion

            #region Add

            [Command("add")]
            [Alias("a")]
            [Summary("inserts a game to the game list")]
            public async Task Add(string game, string rolename, string aliases)
            {
                rolename = $"{rolename}{ConfigurationManager.AppSettings["GameRoleSuffix"]}";
                List<Models.Game> games = await Models.Game.GetGamesAsync();
                Models.Game g = games.Find(x => x.Name.Equals(game) || x.Aliases.Any(y => y.Equals(game)));

                if (g == null)
                {
                    List<string> aliasesArray = new List<string>();
                    if (!String.IsNullOrEmpty(aliases))
                    {
                        aliasesArray.AddRange(aliases.Split(','));
                    }

                    Models.Game newGame = new Models.Game(game, aliasesArray, rolename, Context.Message.Author.Id);
                    games.Add(newGame);
                    await Models.Game.SetGamesAsync(games);
                }

                if (!Context.Guild.Roles.ToList().Any(x => x.Name.Equals(rolename)))
                {
                    int red = Convert.ToInt32(ConfigurationManager.AppSettings["EmbedRed"]);
                    int green = Convert.ToInt32(ConfigurationManager.AppSettings["EmbedGreen"]);
                    int blue = Convert.ToInt32(ConfigurationManager.AppSettings["EmbedBlue"]);

                    await Context.Guild.CreateRoleAsync(rolename, null, new Color(red, green, blue));
                }

                await PrintGamesAsync(games);
            }

            #endregion

            #region Remove

            [Command("remove")]
            [Alias("r")]
            [Summary("removes an user from the playerlist")]
            public async Task Remove(string game)
            {
                List<Models.Game> games = await Models.Game.GetGamesAsync();

                if (!String.IsNullOrEmpty(game))
                {
                    games = games.FindAll(x => !(x.Name.Equals(game) || x.Aliases.Any(y => y.Equals(game))));

                    await Models.Game.SetGamesAsync(games);
                }

                await PrintGamesAsync(games);
            }

            #endregion

            #region private Functions

            private async Task PrintGamesAsync(List<Models.Game> games)
            {
                string msg = String.Empty;
                games.ForEach(game =>
                {
                    msg += $"{game.Name} - {game.Role} - {ListHelper.ToCommaSeperatedList(game.Aliases)}\n";
                });

                if (!string.IsNullOrWhiteSpace(msg))
                {
                    await ReplyAsync("", false, EmbedHelper.CreateBuilder(msg, "Games").Build());
                }
            }

            #endregion
        }

        #endregion

        #region Role

        [Group("Role")]
        public class GameRoleModule : ModuleBase<SocketCommandContext>
        {
            #region Get

            [Command("get")]
            [Alias("g")]
            [Summary("prints all player roles")]
            public async Task Get()
            {
                List<SocketRole> roles = Context.Guild.Roles.ToList().FindAll(x => x.Name.EndsWith(ConfigurationManager.AppSettings["GameRoleSuffix"]));

                await PrintGameRolesAsync(roles);
            }

            #endregion

            #region Assign

            [Command("assign")]
            [Alias("a")]
            [Summary("assigns user player role")]
            public async Task Assign(string game, IUser user = null)
            {
                SocketGuildUser socketUser = (SocketGuildUser)(user ?? Context.Message.Author);
                List<SocketRole> roles = Context.Guild.Roles.ToList().FindAll(x => x.Name.EndsWith(ConfigurationManager.AppSettings["GameRoleSuffix"]));

                SocketRole role = roles.Find(x => x.Name.Equals(game));
                if (role == null)
                {
                    List<Models.Game> games = await Models.Game.GetGamesAsync();
                    Models.Game g = games.Find(x => x.Name.Equals(game) || x.Aliases.Any(y => y.Equals(game)));

                    if (g != null)
                    {
                        role = roles.Find(x => x.Name.Equals(g.Role));
                    }
                    else
                    {
                        await ReplyAsync("", false, EmbedHelper.CreateBuilder($"There is no role or game with '{game}'!", "Warning").Build());
                        return;
                    }
                }

                await socketUser.AddRoleAsync(role);
                await Task.Delay(1000);
                await Get();
            }

            #endregion

            #region Remove

            [Command("remove")]
            [Alias("r")]
            [Summary("removes player role from an user")]
            public async Task Remove(string game, IUser user = null)
            {
                SocketGuildUser socketUser = (SocketGuildUser)(user ?? Context.Message.Author);
                List<SocketRole> roles = Context.Guild.Roles.ToList().FindAll(x => x.Name.EndsWith(ConfigurationManager.AppSettings["GameRoleSuffix"]));

                SocketRole role = roles.Find(x => x.Name.Equals(game));
                if (role == null)
                {
                    List<Models.Game> games = await Models.Game.GetGamesAsync();
                    Models.Game g = games.Find(x => x.Name.Equals(game) || x.Aliases.Any(y => y.Equals(game)));

                    if (g != null)
                    {
                        role = roles.Find(x => x.Name.Equals(g.Role));
                    }
                    else
                    {
                        await ReplyAsync("", false, EmbedHelper.CreateBuilder($"There is no role or game with '{game}'!", "Warning").Build());
                        return;
                    }
                }

                await socketUser.RemoveRoleAsync(role);
                await Get();
            }

            #endregion

            #region private Functions

            private async Task PrintGameRolesAsync(List<SocketRole> roles)
            {
                List<Models.Game> games = await Models.Game.GetGamesAsync();

                if (roles.Count > 0)
                {
                    string msg = String.Empty;

                    foreach (SocketRole role in roles)
                    {
                        Models.Game game = games.Find(x => x.Role.Equals(role.Name));
                        msg += $"- {role.Name} - {game.Name} - {ListHelper.ToCommaSeperatedList(game.Aliases)}\n";

                        foreach (SocketGuildUser user in role.Members)
                        {
                            msg += $"      - {user.Username}\n";
                        }
                    }

                    await ReplyAsync("", false, EmbedHelper.CreateBuilder(msg, "Gamer roles").Build());
                }
                else
                {
                    await ReplyAsync("", false, EmbedHelper.CreateBuilder("There are no gamer roles!", "Warning").Build());
                }
            }

            #endregion
        }

        #endregion

        #region Get

        [Command("get")]
        [Alias("g")]
        [Summary("prints the playerlists")]
        public async Task Get()
        {
            Init();
            Dictionary<string, Gamelist> gamelist = (Dictionary<string, Gamelist>)Session.Data["gamelist"];
            List<ulong> gamelistMessages = (List<ulong>)Session.Data["gamelistMessages"];

            await PrintGamelistsAsync(gamelist, gamelistMessages);
        }

        #endregion

        #region Add

        [Command("add")]
        [Alias("a")]
        [Summary("inserts an user to the playerlist")]
        public async Task Add([Summary("The name of the game")]string game, [Summary("The user mention you want to add. (optional)")]IUser otherUser = null)
        {
            Init();
            Dictionary<string, Gamelist> gamelist = (Dictionary<string, Gamelist>)Session.Data["gamelist"];
            List<ulong> gamelistMessages = (List<ulong>)Session.Data["gamelistMessages"];
            List<Models.Game> games = await Models.Game.GetGamesAsync();
            Models.Game g = games.Find(x => x.Name.Equals(game) || x.Aliases.Any(y => y.Equals(game)));

            if (g != null)
            {
                IUser user = (otherUser ?? Context.Message.Author);

                if (!gamelist.ContainsKey(g.Name) || gamelist[g.Name] == null)
                {
                    gamelist.Add(g.Name, new Gamelist(g.Name));
                }

                if ((DateTime.Now - gamelist[g.Name].LastUpdated).Hours > 8)
                {
                    gamelist[g.Name].Users.Clear();
                    await ReplyAsync("", false, EmbedHelper.CreateBuilder($"Playerlist for '{g.Name}' cleared because it's older than 8 hours...", "Warning").Build());
                }

                if (gamelist[g.Name].Users.FindIndex(x => x.Username == user?.Username) == -1)
                {
                    gamelist[g.Name].Users.Add(user);
                    gamelist[g.Name].LastUpdated = DateTime.Now;
                }

                await PrintGamelistsAsync(gamelist, gamelistMessages);
            }
            else
            {
                await ReplyAsync("", false, EmbedHelper.CreateBuilder("Game not found! Please add game first.", "Warning").Build());
            }
        }

        #endregion

        #region Remove

        [Command("remove")]
        [Alias("r")]
        [Summary("removes an user from playerlists")]
        public async Task Remove([Summary("The name of the game")]string game, [Summary("The user you want to add. (optional)")]IUser otherUser = null)
        {
            Init();
            Dictionary<string, Gamelist> gamelist = (Dictionary<string, Gamelist>)Session.Data["gamelist"];
            List<ulong> gamelistMessages = (List<ulong>)Session.Data["gamelistMessages"];
            List<Models.Game> games = await Models.Game.GetGamesAsync();
            Models.Game g = games.Find(x => x.Name.Equals(game) || x.Aliases.Any(y => y.Equals(game)));

            if (g != null)
            {
                IUser user = (otherUser ?? Context.Message.Author);

                int i = gamelist[g.Name].Users.FindIndex(x => x.Username == user?.Username);
                if (i > -1)
                {
                    gamelist[g.Name].Users.RemoveAt(i);
                }

                if (gamelist[g.Name].Users.Count == 0)
                {
                    gamelist.Remove(g.Name);
                }

                await PrintGamelistsAsync(gamelist, gamelistMessages);
            }
        }

        #endregion

        #region Clear

        [Command("clear")]
        [Alias("c")]
        [Summary("clears playerlist from game")]
        public async Task Clear([Summary("The name of the game")]string game)
        {
            Init();
            Dictionary<string, Gamelist> gamelist = (Dictionary<string, Gamelist>)Session.Data["gamelist"];
            List<ulong> gamelistMessages = (List<ulong>)Session.Data["gamelistMessages"];
            List<Models.Game> games = await Models.Game.GetGamesAsync();
            Models.Game g = games.Find(x => x.Name.Equals(game) || x.Aliases.Any(y => y.Equals(game)));

            if (g != null)
            {
                if (String.IsNullOrEmpty(g.Name))
                {
                    gamelist.Clear();
                }
                else
                {
                    gamelist.Remove(g.Name);
                }

                await PrintGamelistsAsync(gamelist, gamelistMessages);
            }
        }

        #endregion

        #region private Functions

        private void Init()
        {
            if (!Session.Data.ContainsKey("gamelist") || Session.Data["gamelist"] == null)
            {
                Session.Data["gamelist"] = new Dictionary<string, Gamelist>();
            }
            if (!Session.Data.ContainsKey("gamelistMessages") || Session.Data["gamelistMessages"] == null)
            {
                Session.Data["gamelistMessages"] = new List<ulong>();
            }
        }

        private async Task PrintGamelistsAsync(Dictionary<string, Gamelist> gamelist, List<ulong> gamelistMessages)
        {
            if (gamelistMessages.Count > 0)
            {
                await Context.Channel.DeleteMessagesAsync(gamelistMessages);
            }

            if (gamelist.Count > 0)
            {
                foreach (KeyValuePair<string, Gamelist> game in gamelist)
                {
                    if (game.Value.Users.Count > 0)
                    {
                        string msg = String.Empty;
                        game.Value.Users.ForEach(user =>
                        {
                            msg += $"- {user.Mention}\n";
                        });

                        if (!string.IsNullOrWhiteSpace(msg))
                        {
                            await ReplyAsync("", false, EmbedHelper.CreateBuilder(msg, game.Key).Build());
                        }
                    }
                }
            }
            else
            {
                await ReplyAsync("", false, EmbedHelper.CreateBuilder("Gamelist is empty!", "Warning").Build());
            }
        }

        #endregion
    }
}
