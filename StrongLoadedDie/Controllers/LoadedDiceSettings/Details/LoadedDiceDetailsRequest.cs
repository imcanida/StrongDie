using System.ComponentModel.DataAnnotations;
using MediatR;
using StrongDieAPI.Controllers.LoadedDiceSettings.Details;

namespace StrongDieAPI.Controllers.LoadedDiceSettings.Details
{
    public sealed class LoadedDiceDetailsRequest : IRequest<LoadedDiceDetailsResponse>
    {
        [Required, Range(1, int.MaxValue)]
        public int SettingsID { get; set; }
    }
}
