
using MediatR;
using Microsoft.AspNetCore.Mvc;
using StrongDieAPI.Controllers.LoadedDiceSettings.Details;
using StrongDieAPI.Controllers.LoadedDiceSettings.List;
using StrongDieAPI.Controllers.LoadedDiceSettings.Update;

namespace StrongDieAPI.Controllers.LoadedDiceSettings
{
    [ApiController]
    [Route("api/loadedDice")]
    public sealed class LoadedDiceSettingsController : ControllerBase
    {
        // May not need --
        private readonly ILogger<LoadedDiceSettingsController> _logger;
        private readonly IMediator _mediator;
        public LoadedDiceSettingsController(ILogger<LoadedDiceSettingsController> logger, IMediator mediator)
        {
            _mediator = mediator;
            _logger = logger;
        }

        /// <summary>
        /// Update the loaded dice settings for a user.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost, Route("update")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(LoadDiceResponse))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update([FromBody] LoadDiceSettingsRequest command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Loading Dice failed, User's ID must be provided.");
            }
            LoadDiceResponse? response;
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
        /// Get the list of loaded dice settings for a user.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost, Route("list")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(LoadedDiceListResponse))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> List([FromBody] LoadedDiceListRequest command)
        {
            if (command.UserID == null && command.UserName == null)
            {
                return NotFound("UserID or UserName must be provided, very secure.");
            }
            LoadedDiceListResponse? response;
            try
            {
                response = await _mediator.Send(command);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting \"loaded\" dice settings.");
                return BadRequest(ex.Message);
            }
            return Ok(response);
        }

        /// <summary>
        /// Get the details of a loaded dice setting for a user.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost, Route("details")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(LoadedDiceDetailsResponse))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Details([FromBody] LoadedDiceDetailsRequest command)
        {
            LoadedDiceDetailsResponse? response;
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
    }
}
