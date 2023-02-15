using NuGet.Frameworks;
using StrongDieAPI.Controllers.Game.Roll;

namespace StrongDieTests.Actions.Roll
{
    [TestClass]
    public class Actions_RollDieHandlerTests
    {
        [TestMethod]
        public async Task Handle_Returns_Correct_Number_Of_Dice_Rolls()
        {
            // Arrange
            var request = new RollDiceRequest
            {
                NumberOfDiceToRoll = 2
            };
            var handler = new RollDiceHandler();

            // Act
            var result = await handler.Handle(request, CancellationToken.None);

            // Assert
            Assert.AreEqual(request.NumberOfDiceToRoll, result.DieRollResults.Length);
        }

        [TestMethod]
        public async Task Handle_Accepts_LoadedDiceSettings()
        {
            // Arrange
            var request = new RollDiceRequest
            {
                NumberOfDiceToRoll = 2,
                LoadedDiceSettings = new LoadedDie[]
                {
                    new LoadedDie()
                    {
                        Favor = 6,
                        Factor = 5
                    }
                }
            };

            var handler = new RollDiceHandler();

            // Act
            var result = await handler.Handle(request, CancellationToken.None);

            // Assert
            Assert.AreEqual(request.NumberOfDiceToRoll, result.DieRollResults.Length);
        }

    }
}