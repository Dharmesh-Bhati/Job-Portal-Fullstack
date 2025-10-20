using JobPortalWebApi.Models;
using JobPortalWebApi.Data;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace JobPortalWebApi.Repositories
{
    // JobSeekerRepository.cs
    public class JobSeekerRepository : GenericRepository<JobSeeker>, IJobSeekerRepository
    {
        public JobSeekerRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<JobSeeker> GetByApplicationUserId(string userId)
        {
            return await _context.JobSeekers.FirstOrDefaultAsync(js => js.ApplicationUserId == userId);
        }
    }
} 