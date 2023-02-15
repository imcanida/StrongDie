using Microsoft.EntityFrameworkCore;
using StrongDieComponents.DbModels;

namespace StrongDieComponents.DbModels.Interfaces
{
    public interface IApplicationDb
    {
        DbSet<LoadedDieSetting> LoadedDieSettings { get; set; }
        DbSet<ApplicationUser> Users { get; set; }
    }
}