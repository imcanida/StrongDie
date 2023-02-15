namespace StrongDieAPI.Models
{
    public class LoadedSetting
    {
        public int? ID { get; set; }
        public int UserID { get; set; }
        public int Index { get; set; }
        /// <summary>
        /// Favored Die Side to Roll
        /// </summary>
        public int Favor { get; set; }
        /// <summary>
        /// Factor to multiply the die roll by
        /// </summary>
        public int Factor { get; set; }
    }
}
