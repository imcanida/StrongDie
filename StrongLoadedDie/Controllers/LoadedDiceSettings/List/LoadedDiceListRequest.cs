using System.ComponentModel.DataAnnotations;
using MediatR;

namespace StrongDieAPI.Controllers.LoadedDiceSettings.List
{
    public sealed class LoadedDiceListRequest : IRequest<LoadedDiceListResponse>
    {
        public int? UserID { get; set; }
        public string UserName { get; set; }
    }
}
