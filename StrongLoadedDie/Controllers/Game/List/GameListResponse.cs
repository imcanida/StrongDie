
using StrongDieAPI.Models;

namespace StrongDieAPI.Controllers.Game.List
{
    /// <summary>
    /// Response Model
    /// </summary>
    public sealed class GameListResponse
    {
        public List<GameListDetail> Games { get; set; } = new();
    }
}
