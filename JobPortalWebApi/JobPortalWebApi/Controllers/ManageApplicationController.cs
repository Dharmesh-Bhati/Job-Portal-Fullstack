using JobPortalWebApi.Data;
using JobPortalWebApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class ManageApplicationController : ControllerBase
{
    private readonly IManageApplicationService _manageApplicationService;
    private readonly UserManager<ApplicationUser> _userManager;

    public ManageApplicationController(
        IManageApplicationService manageApplicationService,
        UserManager<ApplicationUser> userManager)
    {
        _manageApplicationService = manageApplicationService;
        _userManager = userManager;
    }

    [Authorize(Roles = "JobSeeker")]
    [HttpGet("myapplications")]
    public async Task<IActionResult> GetMyApplications()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var applications = await _manageApplicationService.GetMyApplicationsAsync(userId);

        if (applications == null)
        {
            return NotFound("No applications found or user profile incomplete.");
        }

        return Ok(applications);
    }

    

    [Authorize(Roles = "Recruiter")]
    [HttpGet("recruiter/applications")]
    public async Task<IActionResult> GetRecruiterApplications()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        
        var applications = await _manageApplicationService.GetApplicationsForRecruiterAsync(userId);
 
        return Ok(applications);  
    }

    // 📁 Controllers/ManageApplicationController.cs

    [Authorize(Roles = "Recruiter")]
    [HttpGet("recruiter/application/{id}")]
    public async Task<IActionResult> GetSeekerApplication(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
         
        var applicationDto = await _manageApplicationService.GetApplicationDetailsAsync(id, userId);

        if (applicationDto == null)
        {
            return NotFound("Application not found or you do not have permission to view it.");
        }

         
        return Ok(applicationDto);
    }

    [Authorize(Roles = "Recruiter")]
    [HttpPut("recruiter/application/{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var success = await _manageApplicationService.UpdateApplicationStatusAsync(id, status, userId);

        if (!success)
        {
            return NotFound("Application not found or status update failed.");
        }

        return Ok(new { message = $"Application status updated to '{status}'." });
    }

   

    [Authorize(Roles = "Recruiter")]
    [HttpGet("recruiter/job/{jobId}/applicants")]
    public async Task<IActionResult> ViewApplicants(int jobId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
 
        var jobPost = await _manageApplicationService.GetJobPostApplicantsAsync(jobId, userId);

        if (jobPost == null)
        {
             
            return NotFound("Job post not found or you do not have permission to view applicants for it.");
        }
 
        var viewModel = new ViewApplicantsViewModel
        {
            JobId = jobPost.Id, // JobPost से ID लिया
            JobTitle = jobPost.JobTitle, // JobPost से Title लिया

            // JobApplications लिस्ट को ApplicantViewModel लिस्ट में बदलें
            Applicants = jobPost.JobApplications.Select(app => new ApplicantViewModel
            {
                // यहाँ Entity की Nested Navigation Properties से डेटा निकाल कर ViewModel में डाला जाता है
                ApplicantName = app.JobSeeker?.ApplicationUser?.UserName,
                ProfessionTitle = app.JobSeeker?.ProfessionTitle,
                Location = app.JobSeeker?.Location,
                AppliedDate = app.AppliedDate
            }).ToList()
        };
 
        return Ok(viewModel);
    }
}