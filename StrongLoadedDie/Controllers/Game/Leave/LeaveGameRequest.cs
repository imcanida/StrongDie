using System.ComponentModel.DataAnnotations;
using MediatR;

namespace StrongDieAPI.Controllers.Game.Leave
{
    public sealed class LeaveGameRequest : IRequest<LeaveGameResponse>
    {
        public int? UserID { get; set; }

        [Required]
        [StringLength(maximumLength: 100, ErrorMessage = "Username must be atleast 3 characters.", MinimumLength = 3)]
        public string UserName { get; set; } = null!;

        [Range(1, int.MaxValue)]
        public int? GameID { get; set; }
    }
}
