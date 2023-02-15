using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StrongDieComponents.DbModels
{
    public sealed class Game
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity), Column(Order = 1)]
        public int ID { get; set; }
        public ICollection<ApplicationUser> Players { get; set; } = new List<ApplicationUser>();
        [ForeignKey("WinnerID")]
        public ApplicationUser? Winner { get; set; }
        public int WinnerID { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateStarted { get; set; }
        public DateTime? DateEnded { get; set; }
    }
}
