// <auto-generated />
//
// To parse this JSON data, add NuGet 'Newtonsoft.Json' then do:
//
//    using Dororin.Banner;
//
//    var banner = Banner.FromJson(jsonString);

namespace Dororin.Banner
{
    using System;
    using System.Collections.Generic;

    using System.Globalization;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Converters;

    public partial class Banner
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("header")]
        public string Header { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("backgroundImage")]
        public BackgroundImage BackgroundImage { get; set; }

        [JsonProperty("backgroundColor")]
        public string BackgroundColor { get; set; }
    }

    public partial class BackgroundImage
    {
        [JsonProperty("src")]
        public string Src { get; set; }
    }

    public partial class Banner
    {
        public static Banner FromJson(string json) => JsonConvert.DeserializeObject<Banner>(json, Dororin.Banner.Converter.Settings);
    }

    public static class Serialize
    {
        public static string ToJson(this Banner self) => JsonConvert.SerializeObject(self, Dororin.Banner.Converter.Settings);
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