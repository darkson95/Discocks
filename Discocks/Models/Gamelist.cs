using Discord;
using Discord.WebSocket;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Discocks.Models
{
    public class Gamelist
    {
        public string Name { get; set; }

        public DateTime LastUpdated { get; set; } = DateTime.Now;

        public List<IUser> Users { get; set; } = new List<IUser>();

        public Gamelist(string name)
        {
            Name = name;
        }
    }
}
