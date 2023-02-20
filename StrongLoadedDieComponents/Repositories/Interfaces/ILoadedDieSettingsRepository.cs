using StrongDieComponents.DbModels;

namespace StrongDieComponents.Repositories.Interfaces
{
    public interface ILoadedDieSettingsRepository
    {
        Task<LoadedDieSetting> Create(LoadedDieSetting loadedDiceSetting);
        Task<LoadedDieSetting?> GetByID(int id);
        Task<IEnumerable<LoadedDieSetting>> GetByUserID(int userID);
        Task<IEnumerable<LoadedDieSetting>> GetByUserName(string userName);
        Task<LoadedDieSetting[]?> Update(params LoadedDieSetting[]? loadedDiceSettings);
    }
}