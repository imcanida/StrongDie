using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace StrongDieAPI.Controllers
{
    [ApiController]
    [Route("api")]
    public sealed class PingController : ControllerBase
    {
        /// <summary>
        /// Ping the api.
        /// </summary>
        /// <returns>Just a 200 if successful.</returns>
        [HttpPost, Route("ping")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult Get()
        {
            return Ok();
        }
    }
}
