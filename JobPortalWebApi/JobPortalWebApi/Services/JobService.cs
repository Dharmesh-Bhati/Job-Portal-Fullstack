using JobPortalWebApi.Data;
using JobPortalWebApi.Models;
using JobPortalWebApi.Services.Interfaces;
using JobPortalWebApi.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;


namespace JobPortalWebApi.Services
{
    public class JobService : IJobService
    {
        private readonly IUnitOfWork _unitOfWork;

        public JobService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<PostJobViewModel> GetPostJobViewModelAsync()
        {
            var categories = await _unitOfWork.JobCategories.GetAll();
            var selectListItems = categories.Select(c => new SelectListItem
            {
                Value = c.Id.ToString(),
                Text = c.CategoryName
            }).ToList();

            return new PostJobViewModel
            {
                AvailableCategories = selectListItems
            };
        }

        public async Task<Recruiter> GetRecruiterByUserIdAsync(string userId)
        {
            return await _unitOfWork.Recruiters.FindSingleAsync(r => r.ApplicationUserId == userId);
        }

        public async Task PostJobAsync(JobPost jobPost)
        {
            await _unitOfWork.JobPosts.Add(jobPost);
            await _unitOfWork.CompleteAsync();
        }

        public async Task<EditJobViewModel> GetEditJobViewModelAsync(int jobId)
        {
            var job = await _unitOfWork.JobPosts.GetById(jobId);
            if (job == null) return null;

            var categories = await _unitOfWork.JobCategories.GetAll();
            var selectListItems = categories.Select(c => new SelectListItem
            {
                Value = c.Id.ToString(),
                Text = c.CategoryName,
                Selected = c.Id == job.JobCategoryId
            }).ToList();

            var viewModel = new EditJobViewModel
            {
                JobId = job.Id,
                JobTitle = job.JobTitle,
                JobType = job.JobType,
                JobCategoryId = job.JobCategoryId,
                Experience = job.ExperienceLevel,
                Vacancy = job.Vacancy,
                Location = job.Location,
                Skills = job.Skills,
                Description = job.JobDescription,
                PostedDate = job.PostedDate,
                AvailableCategories = selectListItems
            };
            return viewModel;
        }

        public async Task UpdateJobAsync(EditJobViewModel model)
        {
            var jobToUpdate = await _unitOfWork.JobPosts.GetById(model.JobId);
            if (jobToUpdate == null) return;

            jobToUpdate.JobTitle = model.JobTitle;
            jobToUpdate.JobType = model.JobType;
            jobToUpdate.JobCategoryId = model.JobCategoryId;
            jobToUpdate.ExperienceLevel = model.Experience;
            jobToUpdate.Vacancy = model.Vacancy;
            jobToUpdate.Location = model.Location;
            jobToUpdate.Skills = model.Skills;
            jobToUpdate.JobDescription = model.Description;
            jobToUpdate.PostedDate = model.PostedDate;

            _unitOfWork.JobPosts.Update(jobToUpdate);
            await _unitOfWork.CompleteAsync();
        }

        //public async Task DeleteJobAsync(int jobId)
        //{
        //    var jobToDelete = await _unitOfWork.JobPosts.GetById(jobId);
        //    if (jobToDelete == null) return;

        //    _unitOfWork.JobPosts.Delete(jobToDelete);
        //    await _unitOfWork.CompleteAsync();
        //}

        // JobService.cs (या जहाँ भी आपका DeleteJobAsync method है)

        // JobService.cs: DeleteJobAsync method
        public async Task DeleteJobAsync(int jobId)
        {
            // A. JobPost को applications के साथ fetch करने के लिए सही method का उपयोग करें।
            // Note: यह method IJobApplicationRepository में डिफाइन है, इसलिए JobApplications Repository से कॉल होगा।
            var jobToDelete = await _unitOfWork.JobApplications.GetJobPostWithApplicantsAsync(jobId);

            if (jobToDelete == null) return;

            // B. पहले Child Records (JobApplications) को डिलीट करें
            if (jobToDelete.JobApplications != null && jobToDelete.JobApplications.Any())
            {
                // ... (बाकी कोड जैसा है वैसा ही रखें)
                _unitOfWork.JobApplications.DeleteRange(jobToDelete.JobApplications);
            }

            // C. Parent Record (JobPost) को डिलीट करें
            _unitOfWork.JobPosts.Delete(jobToDelete);

            // D. Changes को Save करें
            await _unitOfWork.CompleteAsync();
        }


        public async Task<AllJobsViewModel> GetAllJobsViewModelAsync()
        {
            var jobPosts = await _unitOfWork.JobPosts.GetAllJobsWithDetailsAsync();

            var jobCardViewModels = jobPosts.Select(job => new JobCardViewModel
            {
                JobId = job.Id,
                CompanyLogoUrl = job.Recruiter?.CompanyAddress?.CompanyLogo,
                JobTitle = job.JobTitle,
                JobType = job.JobType,
                JobDescription = job.JobDescription,
                JobCategory = job.JobCategory?.CategoryName,
                CompanyAddress = job.Recruiter?.CompanyAddress?.Address,
                Region = job.Recruiter?.CompanyAddress?.Region,
                City = job.Recruiter?.CompanyAddress?.City,
                Country = job.Recruiter?.CompanyAddress?.Country,
                PostedDate = job.PostedDate
            }).ToList();

            return new AllJobsViewModel { JobCards = jobCardViewModels };
        }

        public async Task<JobDetailViewModel> GetJobDetailViewModelAsync(int jobId)
        {
            var jobPost = await _unitOfWork.JobPosts.GetJobDetailWithCompanyAsync(jobId);
            if (jobPost == null) return null;

            return new JobDetailViewModel
            {
                JobId = jobPost.Id,
                JobTitle = jobPost.JobTitle,
                JobDescription = jobPost.JobDescription,
                JobType = jobPost.JobType,
                ExperienceLevel = jobPost.ExperienceLevel,
                Vacancy = jobPost.Vacancy,
                Skills = jobPost.Skills,
                JobCategory = jobPost.JobCategory?.CategoryName,
                PostedDate = jobPost.PostedDate,
                CompanyName = jobPost.Recruiter?.CompanyAddress?.CompanyName,
                CompanyWebsite = jobPost.Recruiter?.CompanyAddress?.CompanyWebsite,
                CompanyDescription = jobPost.Recruiter?.CompanyAddress?.CompanyDescription,
                CompanyLogoUrl = jobPost.Recruiter?.CompanyAddress?.CompanyLogo,
                CompanyAddress = jobPost.Recruiter?.CompanyAddress?.Address,
                City = jobPost.Recruiter?.CompanyAddress?.City,
                Region = jobPost.Recruiter?.CompanyAddress?.Region,
                Country = jobPost.Recruiter?.CompanyAddress?.Country
            };
        }

 
        public async Task<bool> ApplyForJobAsync(string userId, int jobId)
        {
            var jobSeeker = await _unitOfWork.JobSeekers.FindSingleAsync(js => js.ApplicationUserId == userId);
            if (jobSeeker == null)
            {
                // Profile does not exist, so return false. This is correct.
                return false;
            }

            var existingApplication = await _unitOfWork.JobApplications.FindSingleAsync(ja => ja.JobSeekerId == jobSeeker.Id && ja.JobPostId == jobId);
            if (existingApplication != null)
            {
                // User has already applied, so return true. This is correct.
                return true;
            }

            var jobApplication = new JobApplication
            {
                JobPostId = jobId,
                JobSeekerId = jobSeeker.Id,
                AppliedDate = DateTime.Now,
                Status = "Pending"
            };

            await _unitOfWork.JobApplications.Add(jobApplication);
            await _unitOfWork.CompleteAsync();

            // Now return true if the application was successfully created.
            // This is the fix.
            return true;
        }

        public async Task<bool> HasAppliedForJobAsync(string userId, int jobId)
        {
            var jobSeeker = await _unitOfWork.JobSeekers.FindSingleAsync(js => js.ApplicationUserId == userId);
            if (jobSeeker == null) return false;

            var existingApplication = await _unitOfWork.JobApplications.FindSingleAsync(ja => ja.JobSeekerId == jobSeeker.Id && ja.JobPostId == jobId);
            return existingApplication != null;
        }

        public async Task<List<JobPost>> GetJobsByRecruiterIdAsync(int recruiterId)
        {
            return await _unitOfWork.JobPosts.GetJobsByRecruiterIdAsync(recruiterId);
        }

         public async Task<AllJobsViewModel> SearchJobsAsync(string keywords, string city, string category)
        {
            // Repository se data uthayein using GetJobsBySearchCriteria
            var jobPosts = _unitOfWork.JobPosts.GetJobsBySearchCriteria(keywords, city, category);

            // Ab database se data fetch karein (query ko execute karein)
            var filteredJobs = await jobPosts.ToListAsync();

            // JobPost entities ko JobCard ViewModel mein map karein
            var jobCardViewModels = filteredJobs.Select(job => new JobCardViewModel
            {
                JobId = job.Id,
                JobTitle = job.JobTitle,
                CompanyLogoUrl = job.Recruiter?.CompanyAddress?.CompanyLogo,
                JobDescription = job.JobDescription,
                JobType = job.JobType,
                JobCategory = job.JobCategory?.CategoryName,
                CompanyAddress = job.Recruiter?.CompanyAddress?.Address,
                City = job.Recruiter?.CompanyAddress?.City,
                Region = job.Recruiter?.CompanyAddress?.Region,
                Country = job.Recruiter?.CompanyAddress?.Country,
                PostedDate = job.PostedDate
            }).ToList();

            return new AllJobsViewModel { JobCards = jobCardViewModels };
        }

         
        public async Task<AllJobsViewModel> GetHotJobsViewModelAsync(int count)
        {
            // Sirf pehli 5 jobs ko eager loading ke saath fetch karein
            var jobPosts = await _unitOfWork.JobPosts.GetAllJobsWithDetailsAsync();

            // Yahan hum Top(count) use kar sakte hain
            var hotJobs = jobPosts.Take(count).ToList();

            var jobCardViewModels = hotJobs.Select(job => new JobCardViewModel
            {
                JobId = job.Id,
                CompanyLogoUrl = job.Recruiter?.CompanyAddress?.CompanyLogo,
                JobTitle = job.JobTitle,
                JobType = job.JobType,
                JobDescription = job.JobDescription,
                JobCategory = job.JobCategory?.CategoryName,
                City = job.Recruiter?.CompanyAddress?.City,
                Region = job.Recruiter?.CompanyAddress?.Region,
                PostedDate = job.PostedDate
            }).ToList();

            return new AllJobsViewModel { JobCards = jobCardViewModels };
        }
 
        public async Task<List<ManageJobViewModel>> GetManagedJobsByRecruiterIdAsync(int recruiterId)
    {
         
        var jobPosts = await _unitOfWork.JobPosts.GetJobsByRecruiterIdAsync(recruiterId);

        var viewModelList = jobPosts.Select(jp => new ManageJobViewModel
        {
            Id = jp.Id,
            JobTitle = jp.JobTitle,
            Location = jp.Location,
            Vacancy = jp.Vacancy,
            PostedDate = jp.PostedDate,

            JobType = jp.JobType,

            
            TotalApplications = jp.JobApplications?.Count ?? 0,

             
            Applications = (jp.JobApplications ?? Enumerable.Empty<JobApplication>())
                           .Select(ja => new JobApplicationSummaryViewModel
                           {
                               ApplicationId = ja.Id,
                               Status = ja.Status
                           }).ToList()
        }).ToList();

        return viewModelList;
    }
}
}