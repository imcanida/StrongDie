using System.Net.WebSockets;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using StrongDieComponents.DbModels;
using StrongDieComponents.Repositories.Interfaces;
using StrongLoadedDie.Hubs;

namespace StrongDieAPI.Controllers.Game.Join
{
    public sealed class JoinGameHandler : IRequestHandler<JoinGameRequest, JoinGameResponse>
    {
        private readonly IGameRepository _gameRepository;
        private readonly IUserRepository _userRepository;
        private readonly IHubContext<GameHub> _gameHub;

        public JoinGameHandler(IGameRepository gameRepository, IUserRepository userRepository, IHubContext<GameHub> gameHubContext)
        {
            _userRepository = userRepository;
            _gameRepository = gameRepository;
            _gameHub = gameHubContext;
        }

        public async Task<JoinGameResponse> Handle(JoinGameRequest request, CancellationToken cancellationToken)
        {
            ApplicationUser? user = null;

            // Check if the player exists in the db
            if (request.UserID.HasValue)
            {
                user = await _userRepository.GetByID(request.UserID.Value);
            }
            else if (!string.IsNullOrEmpty(request.UserName))
            {
                user = await _userRepository.GetByUserName(request.UserName);
            }

            // Still no user -- Create it
            if (user == null)
            {
                user = await _userRepository.Create(new ApplicationUser()
                {
                    Name = request.UserName
                });
            }

            // Check if a game exists with less then 4 people
            var game = await _gameRepository.GetByID(request.GameID);
            if (game == null)
            {
                throw new ArgumentException("Game was not found with given ID");
            }

            if (game.Players.Count() >= 4)
            {
                throw new ArgumentException("Game is full");
            }

            // Add the player to the game
            game = await _gameRepository.AddPlayer(game, user);

            var player = new Models.Player()
            {
                UserID = user.ID,
                UserName = user.Name
            };
            await _gameHub.Clients
                        .All
                        //.Group(GameHub.DeriveGameName(game.ID))
                        .SendAsync(GameHub.GameHubMessageTypes.JoinGame.ToString(), player);

            // Return the player and the game
            return new JoinGameResponse()
            {
                GameID = game.ID,
                Player = player,
                Players = game.Players.Select(i => new Models.Player()
                {
                    UserID = i.ID,
                    UserName = i.Name
                }).ToList()
            };
        }
    }
}
