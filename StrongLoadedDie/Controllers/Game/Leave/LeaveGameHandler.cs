using System.Net.WebSockets;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using StrongDieComponents.DbModels;
using StrongDieComponents.Repositories.Interfaces;
using StrongLoadedDie.Hubs;

namespace StrongDieAPI.Controllers.Game.Leave
{
    public sealed class LeaveGameHandler : IRequestHandler<LeaveGameRequest, LeaveGameResponse>
    {
        private readonly IGameRepository _gameRepository;
        private readonly IUserRepository _userRepository;
        private readonly IHubContext<GameHub> _gameHub;

        public LeaveGameHandler(IGameRepository gameRepository, IUserRepository userRepository, IHubContext<GameHub> gameHubContext)
        {
            _userRepository = userRepository;
            _gameRepository = gameRepository;
            _gameHub = gameHubContext;
        }

        public async Task<LeaveGameResponse> Handle(LeaveGameRequest request, CancellationToken cancellationToken)
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

            // Remove the player to the game
            await _gameRepository.RemoveUserFromAllGames(user);

            if (request.GameID.HasValue)
            {
                // Send SignalR LeaveGame
                await _gameHub.Clients
                    .All
                    //.Group(GameHub.DeriveGameName(game.ID))
                    .SendAsync(GameHub.GameHubMessageTypes.LeaveGame.ToString(), new Models.Player()
                    {
                        UserID = user.ID,
                        UserName = user.Name
                    });
            }

            // Return -- Nothing?
            return new LeaveGameResponse()
            {

            };
        }
    }
}
