using System.Text.Encodings.Web;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using JobPortalWebApi.Data;
using JobPortalWebApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using JobPortalWebApi.ViewModels;
//using Microsoft.AspNetCore.Authorization;

namespace JobPortalWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;
        
        private readonly IConfiguration _config;
        private readonly IUnitOfWork _unitOfWork;


        public AccountController(
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context,
            IConfiguration config,
            IUnitOfWork unitOfWork)
        {
            _userManager = userManager;
            _context = context;
            _emailSender = emailSender;
            _config = config;
            _unitOfWork = unitOfWork;
        }

        [HttpPost("register")] // POST request for user registration
        public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                 
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                if (model.UserType == "Recruiter")
                {
                    await _userManager.AddToRoleAsync(user, "Recruiter");

                    
                    var recruiter = new Recruiter { ApplicationUserId = user.Id };

                    await _unitOfWork.Recruiters.Add(recruiter);
                }
                else
                {
                    await _userManager.AddToRoleAsync(user, "JobSeeker");

                   
                    var jobSeeker = new JobSeeker { ApplicationUserId = user.Id };

                    await _unitOfWork.JobSeekers.Add(jobSeeker);
                }
                await _unitOfWork.CompleteAsync();

              

                return Ok(new { message = "Registration successful! You can now log in." });
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }
            return BadRequest(ModelState);
        }

        [HttpPost("login")] // POST request for user login
        //[AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByEmailAsync(model.Email);

            // Check if user exists and password is correct.
            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            

            // Generate JWT token
            var tokenString = GenerateJwtToken(user);

            // Return the token as a JSON response.
            return Ok(new { token = tokenString });
        }

        [HttpPost("logout")] // POST request for logout
        public IActionResult Logout()
        {

            return Ok(new { message = "Logged out successfully (token removed on client side)." });
        }
  
        // Helper method to generate JWT token
        private string GenerateJwtToken(ApplicationUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Name, user.UserName)
            };

            var roles = _userManager.GetRolesAsync(user).Result;
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddHours(24); // Token valid for 24 hours.

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // FORGOT PASSWORD Endpoints (APIs)
        // ---
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByEmailAsync(model.Email);

            // Security measure: Don't reveal if user exists.
            if (user == null || !(await _userManager.IsEmailConfirmedAsync(user)))
            {
                // Return a success message even if the user doesn't exist to prevent enumeration attacks.
                return Ok(new { message = "If your email is registered and confirmed, a password reset link has been sent to it." });
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var callbackUrl = $"http://localhost:3000/reset-password?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(user.Email)}";

            await _emailSender.SendEmailAsync(model.Email, "Reset Password",
                $"Please reset your password by clicking here: <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>link</a>.");

            return Ok(new { message = "A password reset link has been sent to your email." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                // Security measure: Don't reveal if user doesn't exist.
                return BadRequest("Invalid token or email.");
            }

            var result = await _userManager.ResetPasswordAsync(user, model.Token, model.Password);

            if (result.Succeeded)
            {
                return Ok(new { message = "Password reset successfully. You can now log in with your new password." });
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return BadRequest(ModelState);
        }
    }
}
