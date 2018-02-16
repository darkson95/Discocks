using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Discocks.Models
{
    public static class Session
    {
        public static Dictionary<string, object> Data { get; set; } = new Dictionary<string, object>();

        public static Config Config { get; set; }
    }
}
