namespace StrongDieAPI.Models
{
    public class GameListDetail
    {
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
