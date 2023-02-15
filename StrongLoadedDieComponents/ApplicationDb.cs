using Microsoft.EntityFrameworkCore;
using StrongDieComponents.DbModels;
using StrongDieComponents.DbModels.Interfaces;

namespace StrongDieComponents
{
    public class ApplicationDb : DbContext, IApplicationDb
    {
        public ApplicationDb(DbContextOptions<ApplicationDb> options) : base(options)
        {

        }
        
        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseInMemoryDatabase("StrongDie");
        }

        public DbSet<ApplicationUser> Users { get; set; }
        public DbSet<LoadedDieSetting> LoadedDieSettings { get; set; }
        public DbSet<Game> Games { get; set; }
    }
}