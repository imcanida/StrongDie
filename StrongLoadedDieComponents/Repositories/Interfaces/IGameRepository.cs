using StrongDieComponents.DbModels;

namespace StrongDieComponents.Repositories.Interfaces
{
    public interface IGameRepository
    {
        Task<Game> AddPlayer(Game game, ApplicationUser user);
        Task RemoveUserFromAllGames(ApplicationUser user);
        Task<Game> Create(Game newGame);
        Task<Game?> GetByID(int userID);
        Task<IEnumerable<Game>> GetGames();
        Task<Game> Update(Game game);
    }
}