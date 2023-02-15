using MediatR;
using Microsoft.AspNetCore.Mvc;
using StrongDieAPI.Controllers.Game.Details;
using StrongDieAPI.Controllers.Game.Join;
using StrongDieAPI.Controllers.Game.List;

namespace StrongDieAPI.Controllers.Game
{
    [ApiController]
    [Route("api/game")]
    public sealed class GameController : ControllerBase
    {
        private readonly ILogger<GameController> _logger;
        private readonly IMediator _mediator;
        public GameController(ILogger<GameController> logger, IMediator mediator)
        {
            _mediator = mediator;
            _logger = logger;
        }

        /// <summary>
        /// Join a game as a user.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost, Route("join")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(JoinGameResponse))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Join([FromBody] JoinGameRequest command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Join failed.");
            }
            if (command.UserID == null && command.UserName == null)
            {
                return NotFound("UserID or UserName must be provided, in this very secure app.");
            }
            JoinGameResponse? response;
            try
            {
                response = await _mediator.Send(command);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error \"loading\" the dice.");
                return BadRequest(ex.Message);
            }
            return Ok(response);
        }

        /// <summary>
        /// Get the list of games.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost, Route("list")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GameListResponse))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> List([FromBody] GameListRequest command)
        {
            GameListResponse? response = null;
            try
            {
                response = await _mediator.Send(command);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting games.");
                return BadRequest(ex.Message);
            }
            return Ok(response);
        }

        /// <summary>
        /// Get the details of a game.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost, Route("details")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GameDetailsResponse))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Details([FromBody] GameDetailsRequest command)
        {
            GameDetailsResponse? response = null;
            try
            {
                response = await _mediator.Send(command);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting a game details.");
                return BadRequest(ex.Message);
            }
            return Ok(response);
        }
    }
}
