using JobPortalWebApi.Data;
using JobPortalWebApi.Models;
using JobPortalWebApi.Services.Interfaces;
using JobPortalWebApi.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace JobPortalWebApi.Controllers
{
    [ApiController] // Indicates that this is an API controller
    [Route("api/[controller]")] // Defines the API route, e.g., /api/recruiter
    [Authorize(Roles = "Recruiter")]
    public class RecruiterController : ControllerBase // Inherits from ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IRecruiterService _recruiterService;

        public RecruiterController(UserManager<ApplicationUser> userManager, IRecruiterService recruiterService)
        {
            _userManager = userManager;
            _recruiterService = recruiterService;
        }

        [HttpGet("company")] // Defines a specific endpoint for getting company details
        public async Task<IActionResult> GetCompanyDetails()
        {
            // Get the user ID from the claims principal
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                 
                return Unauthorized("User is not authenticated.");
            }

            var viewModel = await _recruiterService.GetCompanyRegistrationViewModel(userId);

            if (viewModel == null)
            {
                // Return a specific status code for a missing resource.
                return NotFound("Company details not found.");
            }

            // Return the ViewModel as a JSON response with a 200 OK status.
            return Ok(viewModel);
        }

        [HttpPost("company")] // Defines the endpoint for registering/updating company details
        public async Task<IActionResult> RegisterCompany([FromForm] CompanyRegistrationViewModel model)
        {
            if (!ModelState.IsValid)
            {
                // Return validation errors as a JSON object with a 400 Bad Request status.
                return BadRequest(ModelState);
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            // The service layer handles the logic.
            await _recruiterService.AddOrUpdateCompanyProfile(userId, model);

            // Return a success message or the created/updated resource.
            return Ok(new { message = "Company profile registered successfully." });
        }
    }
}