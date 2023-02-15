using StrongDieComponents.DbModels;

namespace StrongDieComponents.DbModels.Interfaces
{
    public interface ILoadedDieSetting : IDbEntity
    {
        int Factor { get; set; }
        int Favor { get; set; }
        int Index { get; set; }
        ApplicationUser User { get; set; }
        int UserID { get; set; }
    }
}