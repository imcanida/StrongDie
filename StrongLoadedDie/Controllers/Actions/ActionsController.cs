using MediatR;
using Microsoft.AspNetCore.Mvc;
using StrongDieAPI.Controllers.Game.Roll;

namespace StrongDieAPI.Controllers.Game
{
    [ApiController]
    [Route("api/actions")]
    public sealed class ActionsController : ControllerBase
    {
        private readonly ILogger<ActionsController> _logger;
        private readonly IMediator _mediator;
        public ActionsController(ILogger<ActionsController> logger, IMediator mediator)
        {
            _mediator = mediator;
            _logger = logger;
        }

        [HttpPost, Route("roll")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(RollDiceResponse))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Roll([FromBody] RollDiceRequest command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Rolling Dice failed.");
            }
            RollDiceResponse? response;
            try
            {
                response = await _mediator.Send(command);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error Rolling the dice/die.");
                return BadRequest(ex.Message);
            }
            return Ok(response);
        }
    }
}
