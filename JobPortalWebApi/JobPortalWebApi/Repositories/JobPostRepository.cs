using JobPortalWebApi.Models;
using JobPortalWebApi.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JobPortalWebApi.Data
{
    public class JobPostRepository : GenericRepository<JobPost>, IJobPostRepository
    {
        private readonly ApplicationDbContext _context;

        public JobPostRepository(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }

         public async Task<List<JobPost>> GetAllJobsWithDetailsAsync()
        {
            return await _context.JobPosts
                .Include(j => j.JobCategory)
                .Include(j => j.Recruiter)
                .ThenInclude(r => r.CompanyAddress)
                .ToListAsync();
        }

         public async Task<JobPost> GetJobDetailWithCompanyAsync(int jobId)
        {
            return await _context.JobPosts
                .Include(j => j.JobCategory)
                .Include(j => j.Recruiter)
                .ThenInclude(r => r.CompanyAddress)
                .FirstOrDefaultAsync(j => j.Id == jobId);
        }

         public async Task<List<JobPost>> GetJobsByRecruiterIdAsync(int recruiterId)
        {
            return await _context.JobPosts
                .Include(jp => jp.JobApplications)
                .Include(jp => jp.JobCategory)
                .Include(j => j.JobApplications)
                .Where(j => j.RecruiterId == recruiterId)
                .ToListAsync();
        }

        public IQueryable<JobPost> GetJobsBySearchCriteria(string keywords, string city, string category)
        {
             var jobs = _context.JobPosts
                .Include(j => j.JobCategory)
                .Include(j => j.Recruiter)
                .ThenInclude(r => r.CompanyAddress)
                .AsQueryable();

            // Filtering logic
            if (!string.IsNullOrEmpty(keywords))
            {
                var searchKeywords = keywords.ToLower().Trim();
                jobs = jobs.Where(j =>
                    j.JobTitle.ToLower().Contains(searchKeywords) ||
                    j.Recruiter.CompanyAddress.CompanyName.ToLower().Contains(searchKeywords) ||
                    j.JobDescription.ToLower().Contains(searchKeywords));
            }

            if (!string.IsNullOrEmpty(city))
            {
                var searchCity = city.ToLower().Trim();
                 jobs = jobs.Where(j => j.Recruiter.CompanyAddress != null && j.Recruiter.CompanyAddress.City.ToLower().Contains(searchCity));
            }

            if (!string.IsNullOrEmpty(category) && category != "All Categories")
            {
                 jobs = jobs.Where(j => j.JobCategory != null && j.JobCategory.CategoryName == category);
            }

            return jobs;
        }
    }
}
     