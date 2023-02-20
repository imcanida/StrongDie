using MediatR;
using Microsoft.AspNetCore.SignalR;
using StrongDieAPI.Models;
using StrongDieComponents.DbModels;
using StrongDieComponents.Repositories.Interfaces;
using StrongLoadedDie.Hubs;

namespace StrongDieAPI.Controllers.Game.Roll
{
    public sealed class RollDiceHandler : IRequestHandler<RollDiceRequest, RollDiceResponse>
    {
        private readonly IHubContext<GameHub> _gameHub;
        private readonly IUserRepository _userRepository;

        public RollDiceHandler(IHubContext<GameHub> gameHub, IUserRepository userRepository)
        {
            _gameHub = gameHub;
            _userRepository = userRepository;
        }

        public async Task<RollDiceResponse> Handle(RollDiceRequest request, CancellationToken cancellationToken)
        {
            if (request == null) throw new ArgumentException("No request was provided");

            var rnd = new Random();
            int[] rolls = new int[request.NumberOfDiceToRoll];
            bool isLoaded = request?.LoadedDiceSettings?.Any() ?? false;
            for (int i = 0; i < request?.NumberOfDiceToRoll; i++)
            {
                var dieRoll = rnd.Next(1, 7);
                if (isLoaded && request?.LoadedDiceSettings?.Length > i)
                {
                    var loadedSetting = request?.LoadedDiceSettings[i];
                    if (loadedSetting != null)
                    {
                        // Dice is loaded - for each factor attempt another roll if its not our face.
                        for (int j = 0; j < loadedSetting.Factor; j++)
                        {
                            if (dieRoll == loadedSetting.Favor) break;
                            dieRoll = rnd.Next(1, 7);
                        }
                    }
                }
                rolls[i] = dieRoll;
            }

            // If the roll had a game&user -- send messages to other connections in the group.
            if (request?.GameID.HasValue ?? false && !string.IsNullOrEmpty(request?.UserName))
            {
                // Grab the Player Record - who's rolling.
                var user = await _userRepository.GetByUserName(request.UserName ?? "");
                if (user != null)
                {
                    var dieRollMessage = new RollDiceMessage()
                    {
                        Actor = new Player()
                        {
                            UserID = user.ID,
                            UserName = user.Name
                        },
                        DiceRollResults = rolls
                    };

                    var gameName = GameHub.DeriveGameName(request.GameID.Value);

                    // Send SignalR Client Rolls Results -- To the group of that game only.
                    await _gameHub.Clients
                        .All
                        //.Group(gameName)
                        .SendAsync(GameHub.GameHubMessageTypes.DiceRolled.ToString(), dieRollMessage);
                }
            }

            return new RollDiceResponse()
            {
                DieRollResults = rolls
            };
        }        
    }
}
