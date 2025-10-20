using JobPortalWebApi.Models;
using JobPortalWebApi.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace JobPortalWebApi.Data
{
    public class RecruiterRepository : GenericRepository<Recruiter>, IRecruiterRepository
    {
        public RecruiterRepository(ApplicationDbContext context) : base(context)
        {
        }
        public async Task<Recruiter> GetByApplicationUserIdAsync(string userId)
        {
            return await _context.Recruiters.FirstOrDefaultAsync(r => r.ApplicationUserId == userId);
        }

        public async Task<Recruiter> GetByApplicationUserIdWithCompanyAddress(string userId)
        {
            return await _context.Recruiters
                .Include(r => r.CompanyAddress)
                .FirstOrDefaultAsync(r => r.ApplicationUserId == userId);
        }
    }
}