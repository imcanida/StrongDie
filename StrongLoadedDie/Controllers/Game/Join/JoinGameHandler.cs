using MediatR;
using StrongDieComponents.DbModels;
using StrongDieComponents.Repositories;

namespace StrongDieAPI.Controllers.Game.Join
{
    public sealed class JoinGameHandler : IRequestHandler<JoinGameRequest, JoinGameResponse>
    {
        private readonly UserRepository _userRepository;
        private readonly GameRepository _gameRepository;
        public JoinGameHandler(UserRepository userRepository, GameRepository gameRepository)
        {
            _userRepository = userRepository;
            _gameRepository = gameRepository;
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
            if(game == null)
            {
                throw new ArgumentException("Game was not found with given ID");
            }

            if(game.Players.Count() >= 4)
            {
                throw new ArgumentException("Game was not found with given ID");
            }

            // Add the player to the game
            game = await _gameRepository.AddPlayer(game, user);

            // Return the player and the game
            return new JoinGameResponse()
            {
                GameID = game.ID,
                Player = new Models.Player()
                {
                    UserID = user.ID,
                    UserName = user.Name
                },
                Players = game.Players.Select(i => new Models.Player()
                {
                    UserID = i.ID,
                    UserName = i.Name
                }).ToList()
            };
        }
    }
}
