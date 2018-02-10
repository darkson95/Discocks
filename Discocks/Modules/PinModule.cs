using Discocks.Helper;
using Discord;
using Discord.Commands;
using Discord.WebSocket;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Google.Apis.Upload;
using Google.Apis.Util.Store;
using Google.Apis.YouTube.v3;
using Google.Apis.YouTube.v3.Data;

namespace Discocks.Modules
{
    public class PinModule : ModuleBase<SocketCommandContext>
    {
        [Command("pin")]
        [Alias("p")]
        [Summary("copies the message to the PinnedChannel")]
        private async Task Pin(ulong id, bool quote = false)
        {
            await PinMessage(id, quote);
        }


        private async Task<IText​Channel> GetPinnedChannel()
        {
            string pinned = ConfigurationManager.AppSettings["PinnedChannel"];

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
