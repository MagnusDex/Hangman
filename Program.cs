
using System;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient("ExternalWordProvider", (client) =>
{
    client.BaseAddress = new Uri("https://api.api-ninjas.com/v1/randomword?type=adjective");
    client.DefaultRequestHeaders.Add("X-Api-Key", builder.Configuration["EXTERNAL_WORD_PROVIDER_API_KEY"]);
});

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseHttpsRedirection();

app.MapGet("/random_word", async (IHttpClientFactory httpClientFactory) =>
{
    var client = httpClientFactory.CreateClient("ExternalWordProvider");
    return await client.GetFromJsonAsync<ExternalWordProviderStruct>("");
 })
 .WithName("GetRandomWord");

app.Run();

internal record struct ExternalWordProviderStruct(string Word);

