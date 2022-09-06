using WorkflowBackend.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<IKustoAuthProvider, KustoAuthProvider>();
builder.Services.AddSingleton<IKustoService, KustoService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(cors =>
            cors
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowAnyOrigin()
            .WithExposedHeaders(new string[] { HeaderConstants.ScriptEtagHeader })
            );

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Use(async (context, next) =>
{
    await next();
    if (context.Response.StatusCode == 404 &&
        !Path.HasExtension(context.Request.Path.Value)
        && context.Request.Path != null
        && context.Request.Path.Value != null
        && !context.Request.Path.Value.StartsWith("/api/"))
    {
        context.Request.Path = "/index.html";
        await next();
    }
});

app.UseDefaultFiles();
app.UseStaticFiles();

app.Run();
