using JobPortalWebApi.Models;
using System.Collections.Generic;


namespace JobPortalWebApi.Data
{
    public interface IJobApplicationRepository : IGenericRepository<JobApplication>
    {
        Task<JobApplication> GetExistingApplicationAsync(int jobSeekerId, int jobId);
        Task<List<JobApplication>> GetApplicationsForJobSeekerAsync(int jobSeekerId);
        Task<List<JobApplication>> GetApplicationsForRecruiterAsync(int recruiterId);
        Task<JobApplication> GetApplicationWithDetailsAsync(int applicationId);
        Task<JobPost> GetJobPostWithApplicantsAsync(int jobId);

        void DeleteRange(IEnumerable<JobApplication> entities);
    }
}