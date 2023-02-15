
using StrongDieAPI.Models;

namespace StrongDieAPI.Controllers.LoadedDiceSettings.List
{
    /// <summary>
    /// Response Model
    /// </summary>
    public sealed class LoadedDiceListResponse
    {
        public LoadedSetting[]? LoadedDieSettings { get; set; }
    }
}
