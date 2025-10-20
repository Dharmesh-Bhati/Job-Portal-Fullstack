using JobPortalWebApi.Data;
using JobPortalWebApi.Models;
using JobPortalWebApi.Services.Interfaces;
using JobPortalWebApi.ViewModels;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;

namespace JobPortalWebApi.Services
{
    // JobSeekerService.cs
    public class JobSeekerService : IJobSeekerService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;

        public JobSeekerService(IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }

        public async Task<JobSeekerDetailsViewModel> GetJobSeekerDetailsViewModel(ClaimsPrincipal userPrincipal)
        {
            var user = await _userManager.GetUserAsync(userPrincipal);
            if (user == null)
            {
                throw new InvalidOperationException("User not found.");
            }

            var existingJobSeeker = await _unitOfWork.JobSeekers.GetByApplicationUserId(user.Id);

            if (existingJobSeeker != null)
            {
                return new JobSeekerDetailsViewModel
                {
                    UserName = user.UserName,
                    Email = user.Email,
                    ProfessionTitle = existingJobSeeker.ProfessionTitle,
                    Bio = existingJobSeeker.Bio,
                    Location = existingJobSeeker.Location,
                    Age = existingJobSeeker.Age,
                    Degree = existingJobSeeker.Degree,
                    FieldOfStudy = existingJobSeeker.FieldOfStudy,
                    EducationDescription = existingJobSeeker.EducationDescription,
                    CompanyName = existingJobSeeker.CompanyName,
                    CompanyTitle = existingJobSeeker.CompanyTitle,
                    ExperienceDescription = existingJobSeeker.ExperienceDescription,
                    Skills = existingJobSeeker.Skills,
                    ProfilePictureUrl = existingJobSeeker.ProfilePicture // <-- Ye line add karein
                };
            }
            else
            {
                return new JobSeekerDetailsViewModel
                {
                    UserName = user.UserName,
                    Email = user.Email
                };
            }
        }

        public async Task AddOrUpdateJobSeekerDetails(string userId, JobSeekerDetailsViewModel model)
        {
            var existingJobSeeker = await _unitOfWork.JobSeekers.GetByApplicationUserId(userId);
            string? profilePictureUrl = null;

            // Image handling logic
            if (model.ProfileImage != null)
            {
                if (existingJobSeeker != null && !string.IsNullOrEmpty(existingJobSeeker.ProfilePicture))
                {
                    var oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", existingJobSeeker.ProfilePicture.TrimStart('/'));
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath);
                    }
                }

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + model.ProfileImage.FileName;
                var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "profiles");
                Directory.CreateDirectory(uploads);
                var filePath = Path.Combine(uploads, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await model.ProfileImage.CopyToAsync(fileStream);
                }
                profilePictureUrl = "/images/profiles/" + uniqueFileName;
            }

            if (existingJobSeeker == null)
            {
                var newJobSeeker = new JobSeeker
                {
                    ApplicationUserId = userId,
                    ProfessionTitle = model.ProfessionTitle,
                    Bio = model.Bio,
                    Location = model.Location,
                    Age = model.Age,
                    Degree = model.Degree,
                    FieldOfStudy = model.FieldOfStudy,
                    EducationDescription = model.EducationDescription,
                    CompanyName = model.CompanyName,
                    CompanyTitle = model.CompanyTitle,
                    ExperienceDescription = model.ExperienceDescription,
                    Skills = model.Skills,
                    ProfilePicture = profilePictureUrl
                };
                await _unitOfWork.JobSeekers.Add(newJobSeeker);
            }
            else
            {
                existingJobSeeker.ProfessionTitle = model.ProfessionTitle;
                existingJobSeeker.Bio = model.Bio;
                existingJobSeeker.Location = model.Location;
                existingJobSeeker.Age = model.Age;
                existingJobSeeker.Degree = model.Degree;
                existingJobSeeker.FieldOfStudy = model.FieldOfStudy;
                existingJobSeeker.EducationDescription = model.EducationDescription;
                existingJobSeeker.CompanyName = model.CompanyName;
                existingJobSeeker.CompanyTitle = model.CompanyTitle;
                existingJobSeeker.ExperienceDescription = model.ExperienceDescription;
                existingJobSeeker.Skills = model.Skills;
                if (profilePictureUrl != null)
                {
                    existingJobSeeker.ProfilePicture = profilePictureUrl;
                }
                _unitOfWork.JobSeekers.Update(existingJobSeeker);
            }

            await _unitOfWork.CompleteAsync();
        }

        public async Task<JobSeeker> GetJobSeekerByUserId(string userId)
        {
            return await _unitOfWork.JobSeekers.GetByApplicationUserId(userId);
        }
    } 
}