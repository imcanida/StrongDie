using StrongDieComponents.DbModels;

namespace StrongDieAPI.Controllers.LoadedDiceSettings.Update
{
    /// <summary>
    /// Load Dice Response Model
    /// </summary>
    public sealed class LoadDiceResponse
    {
        public IEnumerable<LoadedDieSetting>? UpdatedLoadedDieSettings { get; set; }
    }
}
