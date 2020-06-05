using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Weather.Models
{
    public class WeatherResponse
    {
        [JsonPropertyName("consolidated_weather")]
        public IEnumerable<WeatherForecast> Forecasts { get; set; }
    }

    public class WeatherForecast
    {
        [JsonPropertyName("applicable_date")]
        public DateTime ApplicableDate { get; set; }
        [JsonPropertyName("weather_state_name")]
        public string StateName { get; set; }
        [JsonPropertyName("weather_state_abbr")]
        public string StateAbbr { get; set; }
    }
}