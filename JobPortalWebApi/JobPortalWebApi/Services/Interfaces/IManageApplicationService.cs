using JobPortalWebApi.Models;

namespace JobPortalWebApi.Services.Interfaces
{
    public interface IManageApplicationService
    {
        Task<List<ApplicationJobSeekerViewModel>> GetMyApplicationsAsync(string userId);
         Task<List<ApplicationRecruiterViewModel>> GetApplicationsForRecruiterAsync(string userId);

        Task<ApplicationDetailViewModel> GetApplicationDetailsAsync(int applicationId, string userId);

        Task<bool> UpdateApplicationStatusAsync(int applicationId, string status, string userId);

        Task<JobPost> GetJobPostApplicantsAsync(int jobId, string userId);
    }
}
