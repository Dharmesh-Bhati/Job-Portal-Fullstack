using JobPortalWebApi.Data;
using JobPortalWebApi.Models;
using JobPortalWebApi.Services.Interfaces;
using JobPortalWebApi.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace JobPortalWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IJobService _jobService;

        public JobController(
            UserManager<ApplicationUser> userManager,
            IJobService jobService)
        {
            _userManager = userManager;
            _jobService = jobService;
        }

        // POST JOB Endpoints (for Recruiters)
        // ---
        [Authorize(Roles = "Recruiter")]
        [HttpGet("post")]
        public async Task<IActionResult> GetJobPostModel()
        {
            var viewModel = await _jobService.GetPostJobViewModelAsync();
            return Ok(viewModel);
        }

        [Authorize(Roles = "Recruiter")]
        [HttpPost("post")]
        public async Task<IActionResult> PostJob([FromBody] PostJobViewModel viewModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var recruiter = await _jobService.GetRecruiterByUserIdAsync(currentUserId);

            if (recruiter == null)
            {
                return NotFound("Recruiter not found.");
            }

            // The mapping logic can be moved to a service layer or kept here.
            var jobPost = new JobPost
            {
                JobTitle = viewModel.JobTitle,
                JobType = viewModel.JobType,
                ExperienceLevel = viewModel.Experience,
                Vacancy = viewModel.Vacancy,
                Location = viewModel.Location,
                Skills = viewModel.Skills,
                JobDescription = viewModel.Description,
                PostedDate = DateTime.Now,
                RecruiterId = recruiter.Id,
                JobCategoryId = viewModel.JobCategoryId
            };

            await _jobService.PostJobAsync(jobPost);

            // Return a success response instead of a redirect
            return Ok(new { message = "Job posted successfully!" });
        }
 
       
        [Authorize(Roles = "Recruiter")]
        [HttpGet("manage")]
        public async Task<IActionResult> ManageJobs()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var recruiter = await _jobService.GetRecruiterByUserIdAsync(userId);

            if (recruiter == null)
            {
                return NotFound("Recruiter profile not found. Please register your company first.");
            }

            var managedJobs = await _jobService.GetManagedJobsByRecruiterIdAsync(recruiter.Id);
            return Ok(managedJobs);
        }

        [Authorize(Roles = "Recruiter")]
        [HttpGet("edit/{id}")]
        public async Task<IActionResult> EditJob(int id)
        {
            var viewModel = await _jobService.GetEditJobViewModelAsync(id);
            if (viewModel == null)
            {
                return NotFound();
            }
            return Ok(viewModel);
        }

        [Authorize(Roles = "Recruiter")]
        [HttpPut("update")]
        public async Task<IActionResult> UpdateJob([FromBody] EditJobViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _jobService.UpdateJobAsync(model);
            return Ok(new { message = "Job updated successfully." });
        }

        [Authorize(Roles = "Recruiter")]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            await _jobService.DeleteJobAsync(id);
            return Ok(new { message = "Job deleted successfully." });
        }

        // PUBLIC & JOBSEEKER Endpoints
        
        [HttpGet("all")]
        public async Task<IActionResult> AllJobs()
        {
            var viewModel = await _jobService.GetAllJobsViewModelAsync();
            return Ok(viewModel);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetJobDetail(int id)
        {
            var viewModel = await _jobService.GetJobDetailViewModelAsync(id);
            if (viewModel == null)
            {
                return NotFound();
            }
            return Ok(viewModel);
        }

        [Authorize(Roles = "JobSeeker")]
        [HttpPost("apply/{jobId}")]
        public async Task<IActionResult> Apply(int jobId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var hasApplied = await _jobService.HasAppliedForJobAsync(userId, jobId);

            if (hasApplied)
            {
                return Conflict(new { message = "You have already applied for this job." });
            }

            var isApplied = await _jobService.ApplyForJobAsync(userId, jobId);

            if (isApplied)
            {
                return Ok(new { message = "Your application has been submitted successfully!" });
            }
            else
            {
                // This will happen if the user's JobSeeker profile doesn't exist.
                return BadRequest(new { message = "Your job seeker profile does not exist. Please create your resume first." });
            }
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchResults(string keywords, string city, string category)
        {
            var viewModel = await _jobService.SearchJobsAsync(keywords, city, category);
            return Ok(viewModel);
        }
    }
}