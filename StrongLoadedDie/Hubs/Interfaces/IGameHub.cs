namespace StrongDieAPI.Hubs.Interfaces
{
    public interface IGameHub
    {
        Task JoinGame(int gameId, string userName);
        Task LeaveGame(int gameId, string userName);
        Task OnDisconnectedAsync(Exception exception);
    }
}