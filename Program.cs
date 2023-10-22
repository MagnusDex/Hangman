
using System;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient("ExternalWordProvider", (client) =>
{
    client.BaseAddress = new Uri("https://api.api-ninjas.com/v1/randomword?type=adjective");
    client.DefaultRequestHeaders.Add("X-Api-Key", builder.Configuration["EXTERNAL_WORD_PROVIDER_API_KEY"]);
});

var app = builder.Build();

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/random_word", async (IHttpClientFactory httpClientFactory) =>
{
    var client = httpClientFactory.CreateClient("ExternalWordProvider");

    // Uncomment the following line to test how intermittent exceptions are handled
    //   if ((new Random()).Next(0, 2) == 1) {throw new InvalidOperationException("Faked exception"); }
    // Uncomment the following line to test how wrong URI is handled
    //   client.BaseAddress = new Uri("https://api.api-ninjas.com/v20/randomword?type=adjective");

    return await client.GetFromJsonAsync<ExternalWordProviderStruct>("");
 })
 .WithName("GetRandomWord");

app.Run();

internal record struct ExternalWordProviderStruct(string Word);

