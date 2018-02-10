using Discord;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Discocks.Helper
{
    public class EmbedHelper
    {
        public static EmbedBuilder CreateBuilder()
        {
            int r = Convert.ToInt32(ConfigurationManager.AppSettings["EmbedRed"]);
            int g = Convert.ToInt32(ConfigurationManager.AppSettings["EmbedGreen"]);
            int b = Convert.ToInt32(ConfigurationManager.AppSettings["EmbedBlue"]);
            var builder = new EmbedBuilder()
            {
                Color = new Color(r, g, b)
            };

            return builder;
        }

        public static EmbedBuilder CreateBuilder(string message, string title = "Information")
        {
            int r = Convert.ToInt32(ConfigurationManager.AppSettings["EmbedRed"]);
            int g = Convert.ToInt32(ConfigurationManager.AppSettings["EmbedGreen"]);
            int b = Convert.ToInt32(ConfigurationManager.AppSettings["EmbedBlue"]);
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
