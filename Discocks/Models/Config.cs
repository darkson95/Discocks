using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Discocks.Models
{
    public class Config
    {
        public string BotToken { get; set; }

        public string Prefix { get; set; }

        public string Game { get; set; }

        public string GameRoleSuffix { get; set; }

        public int  EmbedRed { get; set; }

        public int EmbedGreen { get; set; }

        public int EmbedBlue { get; set; }

        public string PinnedChannel { get; set; }

        public string MusicChannel { get; set; }

        public string YouTubePlaylistId { get; set; }

        public string YouTubeClientId { get; set; }

        public string YouTubeClientSecret { get; set; }

        public static async Task<Config> GetAsync()
        {
            string path = @".\Discocks.Config.json";
            FileInfo fi = new FileInfo(path);

            if (fi.Exists)
            {
                using (StreamReader reader = fi.OpenText())
                {
                    string json = await reader.ReadToEndAsync();

                    return JsonConvert.DeserializeObject<Config>(json);
                }
            }
            else
            {
                return null;
            }

        }

        public static async Task<Config> SetAsync(Config cfg)
        {
            string path = @".\Discocks.Config.json";
            FileInfo fi = new FileInfo(path);
            string json = JsonConvert.SerializeObject(cfg);

            if (fi.Exists)
            {
                using (StreamWriter writer = new StreamWriter(fi.Open(FileMode.Truncate)))
                {
                    writer.Write(json);
                }
            }
            else
            {
                using (StreamWriter writer = fi.CreateText())
                {
                    await writer.WriteAsync(json);
                }
            }

            return cfg;
        }

        public static async Task LoadConfig()
        {
            Config cfg = await Config.GetAsync();

            if (cfg == null)
            {
                cfg = new Config();

                Console.WriteLine("There are no configs! Please insert yout configs...");
                foreach (var prop in typeof(Config).GetProperties())
                {
                    Console.WriteLine();
                    Console.Write($"{prop.Name}=");
                    string input = Console.ReadLine();

                    if (prop.PropertyType == typeof(int))
                    {
                        int i = default(int);
                        Int32.TryParse(input, out i);

                        prop.SetValue(cfg, i);
                    }
                    else
                    {
                        prop.SetValue(cfg, input);
                    }

                }

                await Config.SetAsync(cfg);
            }

            Session.Config = cfg;
        }
    }
}
