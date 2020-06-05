using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Weather.Models;

namespace Weather.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private readonly IHttpClientFactory _clientFactory;
        
        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, IHttpClientFactory clientFactory)
        {
            _logger = logger;
            _clientFactory = clientFactory;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var uri = "https://www.metaweather.com/api/location/44418/";
            var request = new HttpRequestMessage(HttpMethod.Get, uri);
            var client = _clientFactory.CreateClient();
            client.DefaultRequestHeaders.Add("accept", "application/json");

            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode) {
                using var responseStream = await response.Content.ReadAsStreamAsync();

                return Ok(await JsonSerializer.DeserializeAsync<WeatherResponse>(responseStream));
            }

            return StatusCode(500);
        }
    }
}
