using Discocks.Models;
using Discord;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Discocks.Helper
{
    public class EmbedHelper
    {
        public static EmbedBuilder CreateBuilder()
        {
            int r = Session.Config.EmbedRed;
            int g = Session.Config.EmbedGreen;
            int b = Session.Config.EmbedBlue;
            var builder = new EmbedBuilder()
            {
                Color = new Color(r, g, b)
            };

            return builder;
        }

        public static EmbedBuilder CreateBuilder(string message, string title = "Information")
        {
            int r = Session.Config.EmbedRed;
            int g = Session.Config.EmbedGreen;
            int b = Session.Config.EmbedBlue;
            var builder = new EmbedBuilder()
            {
                Color = new Color(r, g, b)
            };

            builder.AddField(x =>
            {
                x.Name = title;
                x.Value = message;
                x.IsInline = false;
            });

            return builder;
        }
    }
}
