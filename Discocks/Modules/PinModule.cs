using Discocks.Helper;
using Discord;
using Discord.Commands;
using Discord.WebSocket;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Discocks.Models;

namespace Discocks.Modules
{
    public class PinModule : ModuleBase<SocketCommandContext>
    {
        [Command("pin")]
        [Alias("p")]
        [Summary("copies the message to the PinnedChannel")]
        private async Task Pin([Summary("The id of the message you want to pin")]ulong id, [Summary("If true the message will be quoted from the author")]bool quote = false)
        {
            await PinMessage(id, quote);
        }


        private async Task<IText​Channel> GetPinnedChannel()
        {
            string pinned = Session.Config.PinnedChannel;

            IText​Channel pinnedChannel = Context.Guild.TextChannels.ToList().Find(x => x.Name.Equals(pinned));

            if (pinnedChannel == null)
            {
                pinnedChannel = await Context.Guild.CreateTextChannelAsync(pinned);
            }

            return pinnedChannel;
        }


        private async Task PinMessage(ulong id, bool quote)
        {
            IText​Channel pinned = await GetPinnedChannel();

            IMessage message = await Context.Channel.GetMessageAsync(id);

            await pinned.SendMessageAsync(quote ? $"\"{message.Content}\" - {Context.Message.Author.Mention}" : message.Content, message.IsTTS, message.Embeds.Count > 0 ? (Embed)message.Embeds.First() : null);
        }
    }
}
