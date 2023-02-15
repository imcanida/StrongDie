using System.ComponentModel.DataAnnotations;
using MediatR;

namespace StrongDieAPI.Controllers.Game.Details
{
    public sealed class GameDetailsRequest : IRequest<GameDetailsResponse>
    {
        [Required, Range(1, int.MaxValue)]
        public int GameID { get; set; }
    }
}
