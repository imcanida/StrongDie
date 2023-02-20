using System.Reflection;
using MediatR;
using StrongDieComponents;
using StrongDieComponents.DbModels.Interfaces;
using StrongDieComponents.Repositories;
using StrongDieComponents.Repositories.Interfaces;
using StrongLoadedDie.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<IApplicationDb, ApplicationDb>();
builder.Services.AddScoped<ILoadedDieSettingsRepository, LoadedDieSettingsRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IGameRepository, GameRepository>();

// SignalR
builder.Services.AddSignalR().AddJsonProtocol();
// Command and Query Responsibility Segregation using MediatR
builder.Services.AddMediatR(Assembly.GetExecutingAssembly());

// Some Cors so the frontend can hit it.
builder.Services
    .AddCors(options =>
    {
        options.AddPolicy("EzCors", policy =>
        {
            policy.AllowAnyHeader().AllowAnyMethod().SetIsOriginAllowed(_ => true).AllowCredentials();
        });
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
// Setup CORS
app.UseCors("EzCors");

// Register SignalR Hubs.
app.MapHub<GameHub>("/gameHub");

app.Run();
