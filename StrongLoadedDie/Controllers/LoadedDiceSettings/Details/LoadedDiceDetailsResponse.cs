
using StrongDieAPI.Models;

namespace StrongDieAPI.Controllers.LoadedDiceSettings.Details
{
    /// <summary>
    /// Response Model
    /// </summary>
    public sealed class LoadedDiceDetailsResponse
    {
        /// <summary>
        /// The game details
        /// </summary>
        public LoadedSetting Details { get; set; } = new();
    }
}
