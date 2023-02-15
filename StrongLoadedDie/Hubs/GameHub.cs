using Microsoft.AspNetCore.SignalR;

namespace StrongLoadedDie.Hubs
{
    /// <summary>
    /// Game (SignalR) Hub 
    /// </summary>
    public sealed class GameHub : Hub
    {
        public async Task SendMessage(string name, string message)
        {
            // Call the broadcastMessage method to update clients.
            await Clients.All.SendAsync("sendMessage", name, message);
        }

        public async Task PlayerConnected(int gameID, string username)
        {
            await Clients.All.SendAsync("PlayerConnected", gameID, username);
        }

        public async Task RollDice(string username, int[] values)
        {
            await Clients.Others.SendAsync("ReceiveDiceRoll", username, values);
        }
    }
}