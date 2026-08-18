var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Enable serving static files (index.html, css, js, etc.)
app.UseDefaultFiles();
app.UseStaticFiles();

app.Run();
