// <auto-generated />
//
// To parse this JSON data, add NuGet 'Newtonsoft.Json' then do:
//
//    using QuickType;
//
//    var essay = Essay.FromJson(jsonString);

namespace QuickType.Essay
{
    using System;
    using System.Collections.Generic;

    using System.Globalization;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Converters;

    public partial class Essay
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("title")]
        public object Title { get; set; }

        [JsonProperty("body")]
        public object Body { get; set; }

        [JsonProperty("citation")]
        public object Citation { get; set; }

        [JsonProperty("furtherReading")]
        public object FurtherReading { get; set; }

        [JsonProperty("carouselObjectIds")]
        public object CarouselObjectIds { get; set; }

        [JsonProperty("pullquote")]
        public object Pullquote { get; set; }

        [JsonProperty("publishingInformation")]
        public object PublishingInformation { get; set; }

        [JsonProperty("importedId")]
        public object ImportedId { get; set; }

        [JsonProperty("PostId")]
        public object PostId { get; set; }

        [JsonProperty("code")]
        public object Code { get; set; }

        [JsonProperty("publishedDate")]
        public PublishedDate PublishedDate { get; set; }
    }

    public partial class PublishedDate
    {
        [JsonProperty("value")]
        public string Value { get; set; }
    }

    public partial class Essay
    {
        public static Essay FromJson(string json) => JsonConvert.DeserializeObject<Essay>(json, QuickType.Converter.Settings);
    }

    public static class Serialize
    {
        public static string ToJson(this Essay self) => JsonConvert.SerializeObject(self, QuickType.Converter.Settings);
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
