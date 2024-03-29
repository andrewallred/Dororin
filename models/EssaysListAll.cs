// <auto-generated />
//
// To parse this JSON data, add NuGet 'Newtonsoft.Json' then do:
//
//    using Dororin.EssaysListAll;
//
//    var essaysListAll = EssaysListAll.FromJson(jsonString);

namespace Dororin.EssaysListAll
{
    using System;
    using System.Collections.Generic;

    using System.Globalization;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Converters;

    public partial class EssaysListAll
    {
        [JsonProperty("results")]
        public Results Results { get; set; }
    }

    public partial class Results
    {
        [JsonProperty("items")]
        public Item[] Items { get; set; }
    }

    public partial class Item
    {
        [JsonProperty("code")]
        public object Code { get; set; }

        [JsonProperty("title")]
        public object Title { get; set; }

        [JsonProperty("createdDate")]
        public string CreatedDate { get; set; }
    }

    public partial class EssaysListAll
    {
        public static EssaysListAll FromJson(string json) => JsonConvert.DeserializeObject<EssaysListAll>(json, Dororin.EssaysListAll.Converter.Settings);
    }

    public static class Serialize
    {
        public static string ToJson(this EssaysListAll self) => JsonConvert.SerializeObject(self, Dororin.EssaysListAll.Converter.Settings);
    }

    internal static class Converter
    {
        public static readonly JsonSerializerSettings Settings = new JsonSerializerSettings
        {
            MetadataPropertyHandling = MetadataPropertyHandling.Ignore,
            DateParseHandling = DateParseHandling.None,
            Converters =
            {
                new IsoDateTimeConverter { DateTimeStyles = DateTimeStyles.AssumeUniversal }
            },
        };
    }
}
