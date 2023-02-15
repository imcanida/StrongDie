using MediatR;
using StrongDieAPI.Models;
using StrongDieComponents.Repositories;

namespace StrongDieAPI.Controllers.Game.Details
{
    public sealed class GameDetailsHandler : IRequestHandler<GameDetailsRequest, GameDetailsResponse>
    {
        private readonly GameRepository _gameRepository;
        public GameDetailsHandler(GameRepository gameRepository)
        {
            _gameRepository = gameRepository;
        }

        public async Task<GameDetailsResponse> Handle(GameDetailsRequest request, CancellationToken cancellationToken)
        {
            StrongDieComponents.DbModels.Game? game = await _gameRepository.GetByID(request.GameID);
            if (game == null)
            {
                throw new ArgumentException("Game was not found with given id");
            }
            return new GameDetailsResponse()
            {
                Details = new GameListDetail()
                {
                    GameID = game.ID,
                    Players = game.Players.Select(i => new Models.Player()
                    {
                        UserID = i.ID,
                        UserName = i.Name
                    }).ToList()
                }
            };
        }
    }
}
