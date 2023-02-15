using Microsoft.EntityFrameworkCore;
using StrongDieComponents.DbModels;

namespace StrongDieComponents.Repositories
{
    public sealed class LoadedDieSettingsRepository
    {
        private readonly ApplicationDb _db;

        public LoadedDieSettingsRepository(ApplicationDb db)
        {
            _db = db;
        }

        public async Task<LoadedDieSetting?> GetByID(int id)
        {
            return await _db.LoadedDieSettings.FirstOrDefaultAsync(i => i.ID == id);
        }
        
        public async Task<IEnumerable<LoadedDieSetting>> GetByUserID(int userID)
        {
            return await _db.LoadedDieSettings.Where(i => i.UserID == userID).ToListAsync();
        }

        public async Task<IEnumerable<LoadedDieSetting>> GetByUserName(string userName)
        {
            var result = await _db.Users
                 .Include(ent => ent.LoadedDieSettings)
                 .FirstOrDefaultAsync(i => i.Name == userName);
            return result?.LoadedDieSettings?.ToList() ?? new List<LoadedDieSetting>();
        }

        public async Task<LoadedDieSetting[]?> Update(params LoadedDieSetting[]? loadedDiceSettings)
        {
            if (loadedDiceSettings == null)
            {
                return loadedDiceSettings;
            }
            // Pull all User's LoadedDieSettings
            foreach (var loadedDieSetting in loadedDiceSettings)
            {
                // Check if the loadedDieSetting exists
                if (loadedDieSetting.ID == 0)
                {
                    // If not, add it.
                    _db.LoadedDieSettings.Add(loadedDieSetting);
                    continue;
                }
                
                var existsCheck = _db.LoadedDieSettings
                    .FirstOrDefault(i => i.ID == loadedDieSetting.ID && i.UserID == loadedDieSetting.UserID);
                
                if(existsCheck == null)
                {
                    _db.LoadedDieSettings.Add(loadedDieSetting);
                    continue;
                }
                _db.LoadedDieSettings.Update(loadedDieSetting);
            }
            await _db.SaveChangesAsync();
            return loadedDiceSettings;
        }

        public async Task<LoadedDieSetting> Create(LoadedDieSetting loadedDiceSetting)
        {
            _db.LoadedDieSettings.Add(loadedDiceSetting);
            await _db.SaveChangesAsync();
            return loadedDiceSetting;
        }
    }
}
