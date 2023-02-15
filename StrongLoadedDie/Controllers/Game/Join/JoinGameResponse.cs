
using StrongDieAPI.Models;

namespace StrongDieAPI.Controllers.Game.Join
{
    /// <summary>
    /// Response Model
    /// </summary>
    public sealed class JoinGameResponse
    {
        /// <summary>
        /// The player that joined the game.
        /// </summary>
        public Player Player { get; set; } = new();
        /// <summary>
        /// The game the player joined.
        /// </summary>
        public int GameID { get; set; }
        /// <summary>
        /// The players in the game.
        /// </summary>
        public List<Player> Players { get; set; } = new();
    }
}
