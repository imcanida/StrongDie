using System.ComponentModel.DataAnnotations;
using MediatR;
using StrongDieComponents.DbModels;
using StrongDieComponents.Repositories;

namespace StrongDieAPI.Controllers.LoadedDiceSettings.Update
{
    public class LoadDiceSettingsHandler : IRequestHandler<LoadDiceSettingsRequest, LoadDiceResponse>
    {
        private readonly LoadedDieSettingsRepository _loadedDiceSettingsRepository;
        private readonly UserRepository _userRepository;

        public LoadDiceSettingsHandler(LoadedDieSettingsRepository loadedDiceSettingsRepository, UserRepository userRepository)
        {
            _loadedDiceSettingsRepository = loadedDiceSettingsRepository;
            _userRepository = userRepository;
        }

        public async Task<LoadDiceResponse> Handle(LoadDiceSettingsRequest request, CancellationToken cancellationToken)
        {
            LoadedDieSetting[]? loadedDieSettings = new LoadedDieSetting[request.LoadedDieSettings?.Length ?? 0];
            if (request.LoadedDieSettings != null && request.LoadedDieSettings.Any())
            {
                // Validate that the user is real.
                var user = await _userRepository.GetByID(request.UserID);
                if (user == null)
                {
                    throw new ArgumentException($"User was not found with the given UserID: {request.UserID}");
                }

                // Order by index
                var diceSettings = request.LoadedDieSettings.OrderBy(i => i.Index).ToList();
                for (int i = 0; i < diceSettings.Count; i++)
                {
                    var setting = diceSettings[i];
                    loadedDieSettings[i] = new LoadedDieSetting()
                    {
                        Index = setting.Index == i ? setting.Index : i,
                        Factor = setting.Factor,
                        Favor = setting.Favor,
                        UserID = request.UserID
                    };
                }
                loadedDieSettings = await _loadedDiceSettingsRepository.Update(loadedDieSettings);
            }
            return new LoadDiceResponse()
            {
                UpdatedLoadedDieSettings = loadedDieSettings
            };
        }
    }
}
