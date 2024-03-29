// <auto-generated />
//
// To parse this JSON data, add NuGet 'Newtonsoft.Json' then do:
//
//    using Dororin.ToahHomePage;
//
//    var toahHomePage = ToahHomePage.FromJson(jsonString);

namespace Dororin.ToahHomePage
{
    using System;
    using System.Collections.Generic;

    using System.Globalization;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Converters;

    public partial class ToahHomePage
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("components")]
        public Component[] Components { get; set; }

        [JsonProperty("sections")]
        public ToahHomePageSection[] Sections { get; set; }
    }

    public partial class Component
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("template")]
        public Template Template { get; set; }

        [JsonProperty("sections")]
        public ComponentSection[] Sections { get; set; }
    }

    public partial class ComponentSection
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("template")]
        public Template Template { get; set; }
    }

    public partial class Template
    {
        [JsonProperty("name")]
        public string Name { get; set; }
    }

    public partial class ToahHomePageSection
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("template")]
        public Template Template { get; set; }
    }

    public partial class ToahHomePage
    {
        public static ToahHomePage FromJson(string json) => JsonConvert.DeserializeObject<ToahHomePage>(json, Dororin.ToahHomePage.Converter.Settings);
    }

    public static class Serialize
    {
        public static string ToJson(this ToahHomePage self) => JsonConvert.SerializeObject(self, Dororin.ToahHomePage.Converter.Settings);
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
