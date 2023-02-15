
using StrongDieAPI.Models;

namespace StrongDieAPI.Controllers.Game.Details
{
    /// <summary>
    /// Response Model
    /// </summary>
    public sealed class GameDetailsResponse
    {
        /// <summary>
        /// The game details
        /// </summary>
        public GameListDetail Details { get; set; } = new();
    }
}
