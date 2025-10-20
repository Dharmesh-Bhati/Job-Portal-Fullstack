using JobPortalWebApi.Models;
using JobPortalWebApi.Repositories;
using Microsoft.EntityFrameworkCore;

namespace JobPortalWebApi.Data
{
    public class JobCategoryRepository : GenericRepository<JobCategory>, IJobCategoryRepository
    {
        public JobCategoryRepository(ApplicationDbContext context) : base(context) { }

        
    }
}