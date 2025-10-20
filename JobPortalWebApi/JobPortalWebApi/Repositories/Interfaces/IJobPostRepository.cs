using JobPortalWebApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JobPortalWebApi.Data
{
    public interface IJobPostRepository : IGenericRepository<JobPost>
    {
        Task<List<JobPost>> GetAllJobsWithDetailsAsync();
        Task<JobPost> GetJobDetailWithCompanyAsync(int jobId);
        Task<List<JobPost>> GetJobsByRecruiterIdAsync(int recruiterId);
        IQueryable<JobPost> GetJobsBySearchCriteria(string keywords, string city, string category);

    }
}