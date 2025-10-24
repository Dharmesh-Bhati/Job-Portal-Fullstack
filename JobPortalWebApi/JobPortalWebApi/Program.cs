using JobPortalWebApi.Data;
using JobPortalWebApi.Data.SeedData;
using JobPortalWebApi.Repositories;
using JobPortalWebApi.Services;
using JobPortalWebApi.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi.Models;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Configuration.AddJsonFile("appsettings.Secrets.json", optional: true, reloadOnChange: true);
// Your existing services (Repositories, Unit of Work, and Services)
 
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
//options.UseSqlServer(connectionString));
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Identity for user management
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// Add JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt").Get<JwtSettings>();
var key = Encoding.ASCII.GetBytes(jwtSettings.Key);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

builder.Services.AddAuthorization();

// Add controllers for Web API
builder.Services.AddControllers();

// Add CORS policy service registration (Kept as AllowAnyOrigin is correct for Render)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

// Add Swagger/OpenAPI for API documentation and testing
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    // Add JWT authentication to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
    {
      new OpenApiSecurityScheme
      {
        Reference = new OpenApiReference
        {
          Type = ReferenceType.SecurityScheme,
          Id = "Bearer"
        }
      },
      Array.Empty<string>()
    }
    });
});

//   Repository, Unit of Work, and Service Registrations
builder.Services.AddScoped<IJobSeekerRepository, JobSeekerRepository>();
builder.Services.AddScoped<IRecruiterRepository, RecruiterRepository>();
builder.Services.AddScoped<IJobPostRepository, JobPostRepository>();
builder.Services.AddScoped<IJobCategoryRepository, JobCategoryRepository>();
builder.Services.AddScoped<IJobApplicationRepository, JobApplicationRepository>();

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

builder.Services.AddScoped<IJobSeekerService, JobSeekerService>();
builder.Services.AddScoped<IRecruiterService, RecruiterService>();
builder.Services.AddScoped<IJobService, JobService>();
builder.Services.AddScoped<IManageApplicationService, ManageApplicationService>();

var app = builder.Build();

// ----------------------------------------------------------------------
// RENDER DEBUG FIX: Use Developer Exception Page globally to capture 500 errors
// ----------------------------------------------------------------------
app.UseDeveloperExceptionPage();
app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1"));
// ----------------------------------------------------------------------

// HSTS/ExceptionHandler removed for debugging, but we keep HttpsRedirection
app.UseHttpsRedirection();
app.UseRouting();

// ----------------------------------------------------------------------
// RENDER FINAL ABERRANT CORS FIX: Custom Middleware to force CORS Headers
// This must be placed after UseRouting() and before UseAuthentication()
// ----------------------------------------------------------------------
app.Use(async (context, next) =>
{
    // Force Access-Control-Allow-Origin: * on every response
    context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
    context.Response.Headers.Add("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    context.Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

    // Handle Preflight requests (OPTIONS method) immediately
    if (context.Request.Method == "OPTIONS")
    {
        context.Response.StatusCode = 200;
        await context.Response.CompleteAsync();
    }
    else
    {
        await next();
    }
});
// ----------------------------------------------------------------------

// The standard app.UseCors("AllowReactApp"); is now replaced by the custom middleware above.

app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

// Map controllers for Web API endpoints
app.MapControllers();

// ----------------------------------------------------------------------
// RENDER FREE TIER FIX: Force Database Migration and Seeding before App Run
// ----------------------------------------------------------------------
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();

        // 1. Force database migration (Creates schema if it doesn't exist)
        context.Database.Migrate();

        // 2. Seed Identity Data (Users/Roles)
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

        // Using .Wait() to ensure the async task completes synchronously before continuing (Critical for startup health checks)
        DbInitializer.Initialize(userManager, roleManager).Wait();

        // 3. Seed Job Category Data
        JobCategoryDataSeeder.SeedCategories(context);

    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating or seeding the database.");
    }
}
// ----------------------------------------------------------------------

app.Run();

// Helper class for JWT settings from appsettings.json
public class JwtSettings
{
    public string Key { get; set; }
    public string Issuer { get; set; }
    public string Audience { get; set; }
}
