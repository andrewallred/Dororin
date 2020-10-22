// <auto-generated />
//
// To parse this JSON data, add NuGet 'Newtonsoft.Json' then do:
//
//    using Dororin.FeaturedContent;
//
//    var featuredContent = FeaturedContent.FromJson(jsonString);

namespace Dororin.FeaturedContent
{
    using System;
    using System.Collections.Generic;

    using System.Globalization;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Converters;

    public partial class FeaturedContent
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("header")]
        public string Header { get; set; }

        [JsonProperty("content")]
        public Content[] Content { get; set; }
    }

    public partial class Content
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("template")]
        public Template Template { get; set; }

        [JsonProperty("header")]
        public string Header { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("image")]
        public string Image { get; set; }
    }

    public partial class Template
    {
        [JsonProperty("name")]
        public string Name { get; set; }
    }

    public partial class FeaturedContent
    {
        public static FeaturedContent FromJson(string json) => JsonConvert.DeserializeObject<FeaturedContent>(json, Dororin.FeaturedContent.Converter.Settings);
    }

    public static class Serialize
    {
        public static string ToJson(this FeaturedContent self) => JsonConvert.SerializeObject(self, Dororin.FeaturedContent.Converter.Settings);
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
