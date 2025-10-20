using JobPortalWebApi.Models;
using System;
using System.Threading.Tasks;

namespace JobPortalWebApi.Data
{
    // IUnitOfWork.cs
    public interface IUnitOfWork : IDisposable
    {
        IJobSeekerRepository JobSeekers { get; }
        IRecruiterRepository Recruiters { get; }
        IJobPostRepository JobPosts { get; }
        IJobCategoryRepository JobCategories { get; } 
        IJobApplicationRepository JobApplications { get; }  

        Task<int> CompleteAsync();
    }
}