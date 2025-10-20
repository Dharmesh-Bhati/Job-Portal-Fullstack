using JobPortalWebApi.Models;
using JobPortalWebApi.ViewModels;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace JobPortalWebApi.Services.Interfaces
{
    // IJobSeekerService.cs
    public interface IJobSeekerService
    {
        Task<JobSeekerDetailsViewModel> GetJobSeekerDetailsViewModel(ClaimsPrincipal userPrincipal);
        Task<JobSeeker> GetJobSeekerByUserId(string userId);
        Task AddOrUpdateJobSeekerDetails(string userId, JobSeekerDetailsViewModel model);
    }
}