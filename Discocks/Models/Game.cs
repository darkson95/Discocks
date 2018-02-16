using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Discocks.Models
{
    public class Game
    {
        public string Name { get; set; }

        public List<string> Aliases { get; set; }

        public DateTime Created_At { get; set; }

        public ulong Creator { get; set; }

        public string Role { get; set; }

        public Game(string name, List<string> aliases, string rolename, ulong creator)
        {
            Name = name;
            Aliases = aliases;
            Created_At = DateTime.Now;
            Role = rolename;
            Creator = creator;
        }

        public static async Task<List<Game>> GetGamesAsync()
        {
            List<Game> res = new List<Game>();

            string path = @".\Discocks.Games.json";
            FileInfo gamesFile = new FileInfo(path);

            if (gamesFile.Exists)
            {
                using (StreamReader reader = gamesFile.OpenText())
                {
                    string json = await reader.ReadToEndAsync();

                    res = JsonConvert.DeserializeObject<List<Game>>(json);
                }
            }
            else
            {
                using (StreamWriter writer = gamesFile.CreateText())
                {
                    await writer.WriteAsync("[]");
                }
            }

            return res;
        }

        public static async Task<List<Game>> SetGamesAsync(List<Game> games)
        {
            List<Game> res = new List<Game>();

            string path = @".\Discocks.Games.json";
            FileInfo gamesFile = new FileInfo(path);

            string json = JsonConvert.SerializeObject(games);

            if (gamesFile.Exists)
            {
                using (StreamWriter writer = new StreamWriter(gamesFile.Open(FileMode.Truncate)))
                {
                    writer.Write(json);
                }
            }
            else
            {
                using (StreamWriter writer = gamesFile.CreateText())
                {
                    await writer.WriteAsync(json);
                }
            }

            return res;
        }
    }
}
