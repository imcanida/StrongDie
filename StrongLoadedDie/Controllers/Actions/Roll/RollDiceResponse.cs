
namespace StrongDieAPI.Controllers.Game.Roll
{
    /// <summary>
    /// Response Model
    /// </summary>
    public sealed class RollDiceResponse
    {
        public int[] DieRollResults { get; set; } = Array.Empty<int>();
    }
}
