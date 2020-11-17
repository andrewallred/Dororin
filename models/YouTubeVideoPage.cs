// <auto-generated />
//
// To parse this JSON data, add NuGet 'Newtonsoft.Json' then do:
//
//    using Dororin.YouTubeVideoPage;
//
//    var youTubeVideoPage = YouTubeVideoPage.FromJson(jsonString);

namespace Dororin.YouTubeVideoPage
{
    using System;
    using System.Collections.Generic;

    using System.Globalization;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Converters;

    public partial class YouTubeVideoPage
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("youTubeID")]
        public string YouTubeId { get; set; }

        [JsonProperty("verticals")]
        public Verticals Verticals { get; set; }

        [JsonProperty("topics")]
        public Topics Topics { get; set; }

        [JsonProperty("components")]
        public Component[] Components { get; set; }

        [JsonProperty("sections")]
        public YouTubeVideoPageSection[] Sections { get; set; }
    }

    public partial class Component
    {
        [JsonProperty("sections")]
        public ComponentSection[] Sections { get; set; }
    }

    public partial class ComponentSection
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("template")]
        public Template Template { get; set; }
    }

    public partial class Template
    {
        [JsonProperty("name")]
        public string Name { get; set; }
    }

    public partial class YouTubeVideoPageSection
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("template")]
        public Template Template { get; set; }
    }

    public partial class Topics
    {
        [JsonProperty("targetItems")]
        public TargetItem[] TargetItems { get; set; }
    }

    public partial class TargetItem
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("url")]
        public string Url { get; set; }
    }

    public partial class Verticals
    {
        [JsonProperty("targetItems")]
        public TargetItem[] TargetItems { get; set; }
    }

    public partial class YouTubeVideoPage
    {
        public static YouTubeVideoPage FromJson(string json) => JsonConvert.DeserializeObject<YouTubeVideoPage>(json, Dororin.YouTubeVideoPage.Converter.Settings);
    }

    public static class Serialize
    {
        public static string ToJson(this YouTubeVideoPage self) => JsonConvert.SerializeObject(self, Dororin.YouTubeVideoPage.Converter.Settings);
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