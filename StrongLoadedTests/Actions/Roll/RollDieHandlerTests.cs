using Microsoft.AspNetCore.SignalR;
using Moq;
using StrongDieAPI.Controllers.Game.Roll;
using StrongDieComponents.Repositories.Interfaces;
using StrongLoadedDie.Hubs;

namespace StrongDieTests.Actions.Roll
{
    [TestClass]
    public class Actions_RollDieHandlerTests
    {
        private RollDiceHandler _controller = null!;
        private Mock<IUserRepository> _mockUserRepository = null!;
        private Mock<IHubContext<GameHub>> _mockGameHub = null!;

        [TestInitialize]
        public void Setup()
        {
            _mockUserRepository = new Mock<IUserRepository>();
            _mockGameHub = new Mock<IHubContext<GameHub>>();
            _controller = new RollDiceHandler(_mockGameHub.Object, _mockUserRepository.Object);
        }

        [TestMethod]
        public async Task Handle_Returns_Correct_Number_Of_Dice_Rolls()
        {
            // Arrange
            var request = new RollDiceRequest
            {
                NumberOfDiceToRoll = 2
            };

            // Act
            var result = await _controller.Handle(request, CancellationToken.None);

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
            
            // Act
            var result = await _controller.Handle(request, CancellationToken.None);

            // Assert
            Assert.AreEqual(request.NumberOfDiceToRoll, result.DieRollResults.Length);
        }

    }
}