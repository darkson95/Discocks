using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Discocks.Helper
{
    public static class ListHelper
    {
        public static string ToCommaSeperatedList(List<string> texts)
        {
            StringBuilder sb = new StringBuilder();

            texts.ForEach(x =>
            {
                sb.Append(x);
                sb.Append(", ");
            });

            sb.Remove(sb.Length - 2, 2);

            return sb.ToString();
        }
    }
}
