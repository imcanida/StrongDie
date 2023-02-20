using StrongDieComponents.DbModels;

namespace StrongDieComponents.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<ApplicationUser> Create(ApplicationUser user);
        Task<ApplicationUser?> GetByID(int userID);
        Task<ApplicationUser?> GetByUserName(string userName);
        Task<IEnumerable<ApplicationUser>> GetUsers();
    }
}