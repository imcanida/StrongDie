using MediatR;
using StrongDieAPI.Models;
using System.ComponentModel.DataAnnotations;

namespace StrongDieAPI.Controllers.LoadedDiceSettings.Update
{
    public sealed class LoadDiceSettingsRequest : IRequest<LoadDiceResponse>
    {
        [Required]
        public int UserID { get; set; }
        public LoadedSetting[]? LoadedDieSettings { get; set; }
    }
}
