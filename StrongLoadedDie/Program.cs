using System.Reflection;
using MediatR;
using StrongDieComponents;
using StrongDieComponents.Repositories;
using StrongLoadedDie.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDb>();
builder.Services.AddScoped<LoadedDieSettingsRepository>();
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<GameRepository>();

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
