using System.ComponentModel.DataAnnotations;
using MediatR;

namespace StrongDieAPI.Controllers.Game.Roll
{
    public sealed class RollDiceRequest : IRequest<RollDiceResponse>
    {
        /// <summary>
        /// User ID of the player rolling the dice
        /// </summary>
        public int? UserID { get; set; }
        /// <summary>
        /// User Name of the player rolling the dice
        /// </summary>
        public string? UserName { get; set; }
        /// <summary>
        /// Game ID of the game the player is rolling the dice in
        /// </summary>
        public int? GameID { get; set; }
        /// <summary>
        /// Number of dice to roll
        /// </summary>
        [Required, Range(1, 10)]
        public int NumberOfDiceToRoll { get; set; } = 2;

        /// <summary>
        /// LoadedDieSettings
        /// </summary>
        public LoadedDie[]? LoadedDiceSettings { get; set; }
    }
    
    public sealed class LoadedDie
    {
        /// <summary>
        /// Index of the die to roll, incase specification of which die to load
        /// </summary>
        public int? Index { get; set; } = 0;
        /// <summary>
        /// Favored Die Side to Roll
        /// </summary>
        [Range(1, 6)]
        public int Favor { get; set; } = 1;
        /// <summary>
        /// Factor to multiply the die roll by
        /// </summary>
        [Range(1, 5)]
        public int Factor { get; set; } = 1;
    }
}
