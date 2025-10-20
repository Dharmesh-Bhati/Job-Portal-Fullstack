
using JobPortalWebApi.Data;
using JobPortalWebApi.Models;
using JobPortalWebApi.Services.Interfaces;

namespace JobPortalWebApi.Services
{
    public class ManageApplicationService : IManageApplicationService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ManageApplicationService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // 📁 Services/ManageApplicationService.cs

        // Interface को भी अपडेट करें: Task<List<ApplicationJobSeekerViewModel>>
        public async Task<List<ApplicationJobSeekerViewModel>> GetMyApplicationsAsync(string userId)
        {
            var jobSeeker = await _unitOfWork.JobSeekers.FindSingleAsync(js => js.ApplicationUserId == userId);
            if (jobSeeker == null)
            {
                return new List<ApplicationJobSeekerViewModel>(); // Return empty list, not null
            }

            var applications = await _unitOfWork.JobApplications.GetApplicationsForJobSeekerAsync(jobSeeker.Id);

            // 🔥 Mapping Logic 🔥
            return applications.Select(app => new ApplicationJobSeekerViewModel
            {
                Id = app.Id,
                Status = app.Status,
                AppliedDate = app.AppliedDate,
                // Null-safe access का उपयोग करें
                JobTitle = app.JobPost?.JobTitle,
                CompanyName = app.JobPost?.Recruiter?.CompanyAddress?.CompanyName
            }).ToList();
        }
        //public async Task<List<JobApplication>> GetApplicationsForRecruiterAsync(string userId)
        //{
        //    var recruiter = await _unitOfWork.Recruiters.FindSingleAsync(r => r.ApplicationUserId == userId);
        //    if (recruiter == null)
        //    {
        //        return null;
        //    }
        //    return await _unitOfWork.JobApplications.GetApplicationsForRecruiterAsync(recruiter.Id);
        //}

        // 📁 Services/ManageApplicationService.cs

        // Update the Interface signature (IManageApplicationService.cs) first:
        // Task<List<ApplicationRecruiterViewModel>> GetApplicationsForRecruiterAsync(string userId);

        public async Task<List<ApplicationRecruiterViewModel>> GetApplicationsForRecruiterAsync(string userId)
        {
            var recruiter = await _unitOfWork.Recruiters.FindSingleAsync(r => r.ApplicationUserId == userId);
            if (recruiter == null)
            {
                return new List<ApplicationRecruiterViewModel>(); // Recruiter not found, return empty list
            }

            // Repository से Enitity Framework objects fetch करें
            var applications = await _unitOfWork.JobApplications.GetApplicationsForRecruiterAsync(recruiter.Id);

            if (applications == null || applications.Count == 0)
            {
                return new List<ApplicationRecruiterViewModel>(); // No applications, return empty list
            }

            // 🔥 Mapping Logic 🔥
            // EF Entities को ViewModels में बदलें
            var applicationViewModels = applications.Select(app => new ApplicationRecruiterViewModel
            {
                Id = app.Id,
                Status = app.Status,
                AppliedDate = app.AppliedDate,

                ApplicantName = app.JobSeeker?.ApplicationUser?.UserName,
                ProfessionTitle = app.JobSeeker?.ProfessionTitle,
                ProfilePicture = app.JobSeeker?.ProfilePicture,

                JobTitle = app.JobPost?.JobTitle
            }).ToList();

            return applicationViewModels;
        }

        // 📁 Services/ManageApplicationService.cs (Mapping Logic)

        public async Task<ApplicationDetailViewModel> GetApplicationDetailsAsync(int applicationId, string userId)
        {
            var application = await _unitOfWork.JobApplications.GetApplicationWithDetailsAsync(applicationId);

            // Security checks...
            if (application == null || application.JobPost.Recruiter.ApplicationUserId != userId) return null;

            // 🔥 Mapping the Entity to DTO 🔥
            return new ApplicationDetailViewModel
            {
                Id = application.Id,
                Status = application.Status,
                AppliedDate = application.AppliedDate,
                JobTitle = application.JobPost?.JobTitle,

                ApplicantUserName = application.JobSeeker?.ApplicationUser?.UserName,
                ApplicantEmail = application.JobSeeker?.ApplicationUser?.Email,
                ProfessionTitle = application.JobSeeker?.ProfessionTitle,
                Location = application.JobSeeker?.Location,
                Bio = application.JobSeeker?.Bio,
                Skills = application.JobSeeker?.Skills,
                EducationDescription = application.JobSeeker?.EducationDescription,
                ProfilePicture = application.JobSeeker?.ProfilePicture,
            };
        }

        public async Task<bool> UpdateApplicationStatusAsync(int applicationId, string status, string userId)
        {
            var application = await _unitOfWork.JobApplications.GetApplicationWithDetailsAsync(applicationId);
            if (application == null)
            {
                return false;
            }
            var recruiter = await _unitOfWork.Recruiters.FindSingleAsync(r => r.ApplicationUserId == userId);
            if (recruiter == null || application.JobPost.RecruiterId != recruiter.Id)
            {
                return false; // Security check fails.
            }
            application.Status = status;
            _unitOfWork.JobApplications.Update(application);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<JobPost> GetJobPostApplicantsAsync(int jobId, string userId)
        {
            var jobPost = await _unitOfWork.JobApplications.GetJobPostWithApplicantsAsync(jobId);
            if (jobPost == null)
            {
                return null;
            }
            var recruiter = await _unitOfWork.Recruiters.FindSingleAsync(r => r.ApplicationUserId == userId);
            if (recruiter == null || jobPost.RecruiterId != recruiter.Id)
            {
                return null; // Security check: Recruiter doesn't own this job post.
            }
            return jobPost;
        }
    }
}
 
 
