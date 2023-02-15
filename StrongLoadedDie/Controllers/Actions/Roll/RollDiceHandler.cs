using MediatR;

namespace StrongDieAPI.Controllers.Game.Roll
{
    public sealed class RollDiceHandler : IRequestHandler<RollDiceRequest, RollDiceResponse>
    {
        public async Task<RollDiceResponse> Handle(RollDiceRequest request, CancellationToken cancellationToken)
        {
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

            return new RollDiceResponse()
            {
                DieRollResults = rolls
            };
        }
    }
}
