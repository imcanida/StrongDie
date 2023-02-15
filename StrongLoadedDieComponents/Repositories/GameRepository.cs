using Microsoft.EntityFrameworkCore;
using StrongDieComponents.DbModels;

namespace StrongDieComponents.Repositories
{
    public sealed class GameRepository
    {
        private readonly ApplicationDb _db;

        public GameRepository(ApplicationDb db)
        {
            _db = db;
        }

        public async Task<IEnumerable<Game>> GetGames()
        {
            return await _db.Games
                .Include(ent => ent.Players)
                .ToListAsync();
        }

        public async Task<Game?> GetByID(int userID)
        {
            return await _db.Games
              .Include(ent => ent.Players)
              .FirstOrDefaultAsync(i => i.ID == userID);
        }

        public async Task<Game> Update(Game game)
        {
            _db.Games.Update(game);
            await _db.SaveChangesAsync();
            return game;
        }

        public async Task<Game> AddPlayer(Game game, ApplicationUser user)
        {
            if (game.Players == null)
            {
                game.Players = new List<ApplicationUser>() { user };
            }
            if (game.Players.Any(i => i.ID == user.ID))
            {
                throw new ArgumentException("User is already in the game.");
            }
            game.Players.Add(user);
            _db.Games.Update(game);
            await _db.SaveChangesAsync();
            return game;
        }

        public async Task<Game> Create(Game newGame)
        {
            _db.Games.Add(newGame);
            await _db.SaveChangesAsync();
            return newGame;
        }
    }
}
