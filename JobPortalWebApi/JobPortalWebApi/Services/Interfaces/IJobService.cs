using JobPortalWebApi.Models;
using JobPortalWebApi.ViewModels;

namespace JobPortalWebApi.Services.Interfaces
{
    public interface IJobService
    {
        Task<PostJobViewModel> GetPostJobViewModelAsync();
        Task<Recruiter> GetRecruiterByUserIdAsync(string userId);
        Task PostJobAsync(JobPost jobPost);
        Task<EditJobViewModel> GetEditJobViewModelAsync(int jobId);
        Task UpdateJobAsync(EditJobViewModel model);
        Task DeleteJobAsync(int jobId);
        Task<AllJobsViewModel> GetAllJobsViewModelAsync();
        Task<JobDetailViewModel> GetJobDetailViewModelAsync(int jobId);
        Task<bool> ApplyForJobAsync(string userId, int jobId);
        Task<bool> HasAppliedForJobAsync(string userId, int jobId);

         
        Task<List<JobPost>> GetJobsByRecruiterIdAsync(int recruiterId);
         

        Task<AllJobsViewModel> SearchJobsAsync(string keywords, string city, string category);

        
        Task<AllJobsViewModel> GetHotJobsViewModelAsync(int count);

        Task<List<ManageJobViewModel>> GetManagedJobsByRecruiterIdAsync(int recruiterId);
    }
}
