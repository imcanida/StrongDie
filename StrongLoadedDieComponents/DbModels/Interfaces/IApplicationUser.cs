namespace StrongDieComponents.DbModels.Interfaces
{
    public interface IApplicationUser : IDbEntity
    {
        int Losses { get; set; }
        string Name { get; set; }
        int Wins { get; set; }
    }
}