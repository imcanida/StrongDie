namespace StrongDieAPI.Models
{
    public class RollDiceMessage
    {
        public Player Actor { get; set; } = null!;
        public int[] DiceRollResults { get; set; } = Array.Empty<int>();
    }
}
