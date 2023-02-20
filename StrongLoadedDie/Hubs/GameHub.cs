using Microsoft.AspNetCore.SignalR;
using StrongDieAPI.Hubs.Interfaces;
using StrongDieAPI.Models;
using StrongDieComponents.DbModels;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace StrongLoadedDie.Hubs
{
    /// <summary>
    /// Game (SignalR) Hub 
    /// </summary>
    public sealed class GameHub : Hub, IGameHub
    {
        public enum GameHubMessageTypes
        {
            SendMessage,
            JoinGame,
            LeaveGame,
            DiceRolled
        }

        public static string DeriveGameName(int gameID)
        {
            return $"Game_#{gameID}";
        }

        private readonly static Dictionary<string, string> _connections = new Dictionary<string, string>();

        public async Task JoinGame(int gameId, string userName)
        {
            var gameName = DeriveGameName(gameId);
            if (_connections.ContainsKey(Context.ConnectionId))
            {
                // Leave the last game.
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, _connections[Context.ConnectionId]);
            }
            _connections.Add(Context.ConnectionId, gameName);
            await Groups.AddToGroupAsync(Context.ConnectionId, gameName);
        }

        public async Task LeaveGame(int gameId, string userName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, DeriveGameName(gameId));
            await SendLeaveGameMessage(gameId, userName);
        }

        public async Task SendLeaveGameMessage(int gameId, string userName)
        {
            var gameName = DeriveGameName(gameId);
            var message = $"{userName} has left the game.";
            await Clients.Group(gameName).SendAsync(GameHubMessageTypes.LeaveGame.ToString(), message);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            if (_connections.TryGetValue(Context.ConnectionId, out string? groupName))
            {
                _connections.Remove(Context.ConnectionId);
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
            }

            await base.OnDisconnectedAsync(exception);
        }

    }
}