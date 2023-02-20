using MediatR;
using StrongDieAPI.Models;
using StrongDieComponents.Repositories.Interfaces;

namespace StrongDieAPI.Controllers.Game.List
{
    public sealed class GameListHandler : IRequestHandler<GameListRequest, GameListResponse>
    {
        private readonly IGameRepository _gameRepository;
        public GameListHandler(IGameRepository gameRepository)
        {
            _gameRepository = gameRepository;
        }

        public async Task<GameListResponse> Handle(GameListRequest request, CancellationToken cancellationToken)
        {
            var games = await _gameRepository.GetGames();
            if (games.Count() == 0)
            {
                // Add a game
                var game = await _gameRepository.Create(new StrongDieComponents.DbModels.Game()
                {
                    DateCreated = DateTime.Now
                });
                games = await _gameRepository.GetGames();
            }
            return new GameListResponse()
            {
                Games = games.Select(i => new GameListDetail()
                {
                    GameID = i.ID,
                    Players = i.Players.Select(t => new Models.Player()
                    {
                        UserID = t.ID,
                        UserName = t.Name
                    }).ToList()
                }).ToList()
            };
        }
    }
}
