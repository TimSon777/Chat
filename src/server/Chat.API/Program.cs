using Chat.DAL.Abstractions.Chat;
using Chat.Infrastructure.MessageHandlers;

var builder = WebApplication.CreateBuilder(args);

var services = builder.Services;
var configuration = builder.Configuration;

var logger = new LoggerFactory().CreateLogger<Program>();

services.AddDatabase(configuration, logger);
//services.AddMessageConsumer(configuration);
services.AddRepositories();
services.AddMessageHandlers();
services.AddSignalR();

var app = builder.Build();

app.MapGet("/history/{count}",
    async (HttpContext context, IChatRepository chatRepository, int count) =>
    {
        var messages = await chatRepository.GetMessagesAsync(count);
        await context.Response.WriteAsJsonAsync(messages);
    });

app.UseRouting();
app.UseEndpoints(endpointsBuilder =>
{
    endpointsBuilder.MapHub<MessageHub>("/forum");
});

app.Run();