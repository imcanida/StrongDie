using Microsoft.EntityFrameworkCore;
using StrongDieComponents.DbModels;

namespace StrongDieComponents.Repositories
{
    public sealed class UserRepository
    {
        private readonly ApplicationDb _db;

        public UserRepository(ApplicationDb db)
        {
            _db = db;
        }

        public async Task<IEnumerable<ApplicationUser>> GetUsers()
        {
            return await _db.Users.ToListAsync();
        }

        public async Task<ApplicationUser?> GetByUserName(string userName)
        {
            return await _db.Users
                .Include(ent => ent.LoadedDieSettings)
                .FirstOrDefaultAsync(i => i.Name == userName);
        }

        public async Task<ApplicationUser?> GetByID(int userID)
        {
            return await _db.Users
                .Include(ent => ent.LoadedDieSettings)
                .FirstOrDefaultAsync(i => i.ID == userID);
        }

        public async Task<ApplicationUser> Create(ApplicationUser user)
        {
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
            return user;
        }
    }
}
