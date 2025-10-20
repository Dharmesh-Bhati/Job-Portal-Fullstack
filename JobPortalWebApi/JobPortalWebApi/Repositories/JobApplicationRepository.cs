using JobPortalWebApi.Data;
using JobPortalWebApi.Models;
using JobPortalWebApi.Repositories;
using Microsoft.EntityFrameworkCore;

public class JobApplicationRepository : GenericRepository<JobApplication>, IJobApplicationRepository
{
    public JobApplicationRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<JobApplication> GetExistingApplicationAsync(int jobSeekerId, int jobId)
    {
        return await _context.JobApplications.FirstOrDefaultAsync(ja => ja.JobSeekerId == jobSeekerId && ja.JobPostId == jobId);
    }

    // 📁 JobApplicationRepository.cs

    public async Task<List<JobApplication>> GetApplicationsForJobSeekerAsync(int jobSeekerId)
    {
        return await _context.JobApplications
            .Include(ja => ja.JobPost)
                .ThenInclude(jp => jp.Recruiter)
                    .ThenInclude(r => r.CompanyAddress)  
            .Where(ja => ja.JobSeekerId == jobSeekerId)
            .OrderByDescending(ja => ja.AppliedDate)
            .ToListAsync();
    }
    public async Task<List<JobApplication>> GetApplicationsForRecruiterAsync(int recruiterId)
    {
        return await _context.JobApplications
            .Include(ja => ja.JobPost)
            .Include(ja => ja.JobSeeker)
                .ThenInclude(js => js.ApplicationUser)
            .Where(ja => ja.JobPost.RecruiterId == recruiterId)
            .OrderByDescending(ja => ja.AppliedDate)
            .ToListAsync();
    }

    // 📁 JobApplicationRepository.cs

    public async Task<JobApplication> GetApplicationWithDetailsAsync(int applicationId)
    {
        return await _context.JobApplications
            .Include(ja => ja.JobPost)
               
                .ThenInclude(jp => jp.Recruiter)
            .Include(ja => ja.JobSeeker)
                .ThenInclude(js => js.ApplicationUser)
            .FirstOrDefaultAsync(ja => ja.Id == applicationId);
    }
    public async Task<JobPost> GetJobPostWithApplicantsAsync(int jobId)
    {
        return await _context.JobPosts
            .Include(jp => jp.JobApplications)
            .ThenInclude(ja => ja.JobSeeker)
            .ThenInclude(js => js.ApplicationUser)
            .Include(jp => jp.Recruiter)
            .FirstOrDefaultAsync(jp => jp.Id == jobId);
    }


    public void DeleteRange(IEnumerable<JobApplication> entities)
    {
        
        _context.JobApplications.RemoveRange(entities);
    }
}
