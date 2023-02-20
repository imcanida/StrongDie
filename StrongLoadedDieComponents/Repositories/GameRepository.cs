using Microsoft.EntityFrameworkCore;
using StrongDieComponents.DbModels;
using StrongDieComponents.Repositories.Interfaces;

namespace StrongDieComponents.Repositories
{
    public sealed class GameRepository : IGameRepository
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
                return game;
            }
            // Check if this player is in another game
            var otherGames = await _db.Games.Include(ent => ent.Players)
                .Where(i => i.Players.FirstOrDefault(i => i.ID == user.ID) != null)
                .ToListAsync();

            // Remove the player from any other games
            foreach (var otherGame in otherGames)
            {
                otherGame.Players.Remove(user);
            }
            game.Players.Add(user);
            _db.Games.Update(game);
            await _db.SaveChangesAsync();
            return game;
        }

        public async Task RemoveUserFromAllGames(ApplicationUser user)
        {
            var games = await _db.Games
                .Include(g => g.Players)
                .Where(g => g.Players.Any(p => p.ID == user.ID))
                .ToListAsync();

            foreach (var game in games)
            {
                game.Players.Remove(user);
            }

            await _db.SaveChangesAsync();
        }

        public async Task<Game> Create(Game newGame)
        {
            _db.Games.Add(newGame);
            await _db.SaveChangesAsync();
            return newGame;
        }
    }
}
