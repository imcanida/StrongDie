using System.ComponentModel.DataAnnotations;
using MediatR;

namespace StrongDieAPI.Controllers.Game.Join
{
    public sealed class JoinGameRequest : IRequest<JoinGameResponse>
    {
        public int? UserID { get; set; }

        [Required]
        [StringLength(maximumLength: 100, ErrorMessage = "Username must be atleast 3 characters.", MinimumLength = 3)]
        public string UserName { get; set; } = null!;

        [Required, Range(1, int.MaxValue)]
        public int GameID { get; set; }
    }
}
