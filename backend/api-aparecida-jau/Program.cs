using api_aparecida_jau.Data;
using Microsoft.EntityFrameworkCore;
using api_aparecida_jau.Mongo;
using api_aparecida_jau.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("AppDbConnectionString");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
);

builder.Services.Configure<MongoDbSettings>(
    builder.Configuration.GetSection("MongoDbSettings"));

builder.Services.AddSingleton<AlbumService>();

var app = builder.Build();

// Aplica as migrations existentes do Entity Framework ao iniciar a API.
// As tentativas permitem aguardar o MySQL terminar a inicialização no Docker.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var tentativas = 0;

    while (true)
    {
        try
        {
            await db.Database.MigrateAsync();
            break;
        }
        catch when (++tentativas < 30)
        {
            await Task.Delay(TimeSpan.FromSeconds(2));
        }
    }
}

app.UseStaticFiles(new StaticFileOptions
{
    ServeUnknownFileTypes = true
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();