using Microsoft.EntityFrameworkCore;
using StrongDieComponents.DbModels;
using StrongDieComponents.Repositories.Interfaces;

namespace StrongDieComponents.Repositories
{
    public sealed class UserRepository : IUserRepository
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
            var existCheck = await _db.Users.FirstOrDefaultAsync(i => i.Name.Equals(user.Name));
            if (existCheck != null)
            {
                throw new ArgumentException("Username is taken");
            }
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
            return user;
        }
    }
}
