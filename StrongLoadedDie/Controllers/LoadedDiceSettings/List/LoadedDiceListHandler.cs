using MediatR;
using StrongDieAPI.Models;
using StrongDieComponents.DbModels;
using StrongDieComponents.Repositories;

namespace StrongDieAPI.Controllers.LoadedDiceSettings.List
{
    public sealed class LoadedDiceListHandler : IRequestHandler<LoadedDiceListRequest, LoadedDiceListResponse>
    {
        private readonly LoadedDieSettingsRepository _loadedDieSettingsRepository;
        public LoadedDiceListHandler(LoadedDieSettingsRepository loadedDieSettingsRepository)
        {
            _loadedDieSettingsRepository = loadedDieSettingsRepository;
        }

        public async Task<LoadedDiceListResponse> Handle(LoadedDiceListRequest request, CancellationToken cancellationToken)
        {
            IEnumerable<LoadedDieSetting> loadedDieSettings = new List<LoadedDieSetting>();
            if (request.UserID.HasValue)
            {
                loadedDieSettings = await _loadedDieSettingsRepository.GetByUserID(request.UserID.Value);
            }
            else
            {
                loadedDieSettings = await _loadedDieSettingsRepository.GetByUserName(request.UserName);
            }
            return new LoadedDiceListResponse()
            {
                LoadedDieSettings = loadedDieSettings.Select(i => new LoadedSetting()
                {
                    Index = i.Index,
                    Factor = i.Factor,
                    Favor = i.Favor,
                    UserID = i.UserID
                }).ToArray()
            };
        }
    }
}
