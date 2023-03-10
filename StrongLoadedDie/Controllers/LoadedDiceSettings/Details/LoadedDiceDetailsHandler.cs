using MediatR;
using StrongDieAPI.Models;
using StrongDieComponents.Repositories.Interfaces;

namespace StrongDieAPI.Controllers.LoadedDiceSettings.Details
{
    public sealed class LoadedDiceDetailsHandler : IRequestHandler<LoadedDiceDetailsRequest, LoadedDiceDetailsResponse>
    {
        private readonly ILoadedDieSettingsRepository _loadedDieSettingsRepository;
        public LoadedDiceDetailsHandler(ILoadedDieSettingsRepository loadedDieSettingsRepository)
        {
            _loadedDieSettingsRepository = loadedDieSettingsRepository;
        }

        public async Task<LoadedDiceDetailsResponse> Handle(LoadedDiceDetailsRequest request, CancellationToken cancellationToken)
        {
            var loadedDieSetting = await _loadedDieSettingsRepository.GetByID(request.SettingsID);
            if (loadedDieSetting == null)
            {
                throw new ArgumentException("Game was not found with given id");
            }
            return new LoadedDiceDetailsResponse()
            {
                Details = new LoadedSetting()
                {
                    ID = loadedDieSetting.ID,
                    Factor = loadedDieSetting.Factor,
                    Favor = loadedDieSetting.Favor,
                    Index = loadedDieSetting.Index,
                    UserID = loadedDieSetting.UserID
                }
            };
        }
    }
}
