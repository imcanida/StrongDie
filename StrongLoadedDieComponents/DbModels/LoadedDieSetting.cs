using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using StrongDieComponents.DbModels.Interfaces;

namespace StrongDieComponents.DbModels
{
    public class LoadedDieSetting : ILoadedDieSetting
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity), Column(Order = 1)]
        public int ID { get; set; }
        [Column(Order = 3)]
        public int Index { get; set; }
        /// <summary>
        /// Favored Die Side to Roll
        /// </summary>
        public int Favor { get; set; }
        /// <summary>
        /// Factor to multiply the die roll by
        /// </summary>
        public int Factor { get; set; }
        /// <summary>
        /// The user who owns this LoadedDieSettings
        /// </summary>
        [ForeignKey("UserID")]
        public ApplicationUser User { get; set; } = null!;
        /// <summary>
        /// UserID of owner of LoadedDieSettings
        /// </summary>
        [Column(Order = 2)]
        public int UserID { get; set; }
    }
}
