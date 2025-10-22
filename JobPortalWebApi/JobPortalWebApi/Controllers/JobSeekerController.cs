using JobPortalWebApi.Data;
using JobPortalWebApi.Services.Interfaces;
using JobPortalWebApi.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "JobSeeker")]
public class JobSeekerController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IJobSeekerService _jobSeekerService;

    public JobSeekerController(UserManager<ApplicationUser> userManager, IJobSeekerService jobSeekerService)
    {
        _userManager = userManager;
        _jobSeekerService = jobSeekerService;
    }


    [HttpGet("details")]
    public async Task<IActionResult> GetJobSeekerDetails()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
        }

        var viewModel = await _jobSeekerService.GetJobSeekerDetailsViewModel(User);
        if (viewModel == null)
        {
            // Or return a specific status code like 204 No Content
            return NotFound("Job seeker details not found. Please add them first.");
        }

        return Ok(viewModel);

     
    }
    // Using a POST request for adding/updating is more RESTful.
    [HttpPost("details")]
    public async Task<IActionResult> AddOrUpdateJobSeekerDetails([FromForm] JobSeekerDetailsViewModel model)
    {
        if (!ModelState.IsValid)
        {
            // Return validation errors to the client
            return BadRequest(ModelState);
        }

        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
        }

        await _jobSeekerService.AddOrUpdateJobSeekerDetails(user.Id, model);

        // Return a success message or the updated resource
        return Ok(new { message = "Job seeker details updated successfully." });
    }


    [HttpGet("resume")]
    public async Task<IActionResult> MyResume()
    {
        try
        {
            var viewModel = await _jobSeekerService.GetJobSeekerDetailsViewModel(User);

            if (viewModel.ProfessionTitle == null)
            {
                return NotFound("Please create your resume first.");
            }

            return Ok(viewModel);
        }
        catch (InvalidOperationException ex)
        {

            return NotFound(ex.Message);
        }
    }
}