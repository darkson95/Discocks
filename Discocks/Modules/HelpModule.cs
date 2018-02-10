using Discocks.Helper;
using Discord;
using Discord.Commands;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Discocks.Modules
{
    public class HelpModule : ModuleBase<SocketCommandContext>
    {
        private readonly CommandService _service;

        public HelpModule(CommandService service)
        {
            _service = service;
        }

        [Command("help")]
        [Alias("h")]
        [Summary("prints help")]
        public async Task HelpAsync()
        {
            string prefix = ConfigurationManager.AppSettings["Prefix"];
            EmbedBuilder builder = EmbedHelper.CreateBuilder();
            builder.Description = "These are the commands you can use";

            foreach (ModuleInfo module in _service.Modules)
            {
                string msg = null;
                foreach (CommandInfo cmd in module.Commands)
                {
                    PreconditionResult result = await cmd.CheckPreconditionsAsync(Context);
                    if (result.IsSuccess)
                        msg += $"{prefix}{cmd.Aliases.First()}{(cmd.Parameters.Count > 0 ? $" {String.Join(" ", cmd.Parameters.Select(p => $"[{p.Name}{(p.IsOptional ? String.Empty : "\\*")}]"))}" : String.Empty)} - {cmd.Summary}\n";
                }

                if (!string.IsNullOrWhiteSpace(msg))
                {
                    builder.AddField(x =>
                    {
                        x.Name = module.Name.Replace("Module", "");
                        x.Value = msg;
                        x.IsInline = false;
                    });
                }
            }

            await ReplyAsync("", false, builder.Build());
        }

        [Command("help")]
        [Alias("h")]
        [Summary("prints help to command")]
        public async Task HelpAsync(string command)
        {
            SearchResult result = _service.Search(Context, command);

            if (!result.IsSuccess)
            {
                await ReplyAsync(null, false, EmbedHelper.CreateBuilder($"Sorry, I couldn't find a command like **{command}**."));
                return;
            }

            string prefix = ConfigurationManager.AppSettings["Prefix"];
            EmbedBuilder builder = EmbedHelper.CreateBuilder();
            builder.Description = $"Here are some commands like **{command}**";

            foreach (CommandMatch match in result.Commands)
            {
                CommandInfo cmd = match.Command;

                builder.AddField(x =>
                {
                    x.Name = String.Join(", ", cmd.Aliases);
                    x.Value = $"Parameters: {(cmd.Parameters.Count > 0 ? "\n      " : String.Empty)}{String.Join("\n      ", cmd.Parameters.Select(p => $"{p.Name}{(p.IsOptional ? String.Empty : "\\*")} - {p.Type.Name}{(String.IsNullOrEmpty(p.Summary) ? String.Empty : $" - ({p.Summary})")}"))}\nSummary:\n      {cmd.Summary}";
                    x.IsInline = false;
                });
            }

            await ReplyAsync("", false, builder.Build());
        }
    }
}
