
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using StrongDieComponents.DbModels.Interfaces;

namespace StrongDieComponents.DbModels
{
    public class ApplicationUser : IApplicationUser
    {
        public ApplicationUser()
        {
            LoadedDieSettings = new List<LoadedDieSetting>();
        }

        public ApplicationUser(string name)
        {
            Name = name;
            LoadedDieSettings = new List<LoadedDieSetting>();
        }

        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity), Column(Order = 1)]
        public int ID { get; set; }
        /// <summary>
        /// User's Name
        /// </summary>
        public string Name { get; set; } = null!;
        /// <summary>
        /// Number of Wins
        /// </summary>
        public int Wins { get; set; }
        /// <summary>
        /// Number of Losses
        /// </summary>
        public int Losses { get; set; }

        public ICollection<LoadedDieSetting> LoadedDieSettings { get; set; } = new List<LoadedDieSetting>();
    }

    public class UserGameAction
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity), Column(Order = 1)]
        public int ID { get; set; }

        /// <summary>
        /// The user who owns this LoadedDieSettings
        /// </summary>
        [ForeignKey("UserID")]
        public ApplicationUser UserActor { get; set; } = null!;
        /// <summary>
        /// UserID of owner of LoadedDieSettings
        /// </summary>
        public int UserActorID { get; set; }

        /// <summary>
        /// The user who owns this LoadedDieSettings
        /// </summary>
        [ForeignKey("UserID")]
        public ApplicationUser UserRecipient { get; set; } = null!;
        /// <summary>
        /// UserID of owner of LoadedDieSettings
        /// </summary>
        public int UserRecipientID { get; set; }
    }
}
