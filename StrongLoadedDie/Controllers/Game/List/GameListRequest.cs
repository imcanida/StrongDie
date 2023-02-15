using System.ComponentModel.DataAnnotations;
using MediatR;

namespace StrongDieAPI.Controllers.Game.List
{
    public sealed class GameListRequest : IRequest<GameListResponse>
    {
        
    }
}
