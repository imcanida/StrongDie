using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using StrongDieAPI.Controllers.Game;
using StrongDieAPI.Controllers.Game.Roll;

namespace StrongDieTests.Actions.Roll
{
    [TestClass]
    public class DiceRollControllerTests
    {
        private ActionsController _controller = null!;
        private Mock<IMediator> _mockMediator = null!;
        private Mock<ILogger<ActionsController>> _mockLogger = null!;

        [TestInitialize]
        public void Setup()
        {
            _mockMediator = new Mock<IMediator>();
            _mockLogger = new Mock<ILogger<ActionsController>>();
            _controller = new ActionsController(_mockLogger.Object, _mockMediator.Object);
        }

        [TestMethod]
        public async Task Roll_ValidRequest_ReturnsOkResult()
        {
            // Arrange
            var request = new RollDiceRequest()
            {
                NumberOfDiceToRoll = 2
            };

            var expectedResponse = new RollDiceResponse()
            {
                DieRollResults = new int[] { 1, 2 }
            };

            _mockMediator.Setup(x => x.Send(request, default)).ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.Roll(request);

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkObjectResult));

            var okResult = (OkObjectResult)result;
            Assert.AreEqual(expectedResponse, okResult.Value);
        }

        [TestMethod]
        public async Task Roll_InvalidRequest_ReturnsBadRequest()
        {
            // Must be Mocked?
            _controller.ModelState.AddModelError("NumberOfDiceToRoll", "The field NumberOfDiceToRoll must be between 1 and 6.");

            // Arrange
            var request = new RollDiceRequest()
            {
                NumberOfDiceToRoll = -1 // Invalid value
            };

            // Act
            var result = await _controller.Roll(request);

            // Assert
            Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
        }

        [TestMethod]
        public async Task Roll_ExceptionThrown_ReturnsBadRequest()
        {
            // Arrange
            var request = new RollDiceRequest()
            {
                NumberOfDiceToRoll = 2
            };

            _mockMediator.Setup(x => x.Send(request, default)).ThrowsAsync(new Exception());

            // Act
            var result = await _controller.Roll(request);

            // Assert
            Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
        }
    }
}