using JobPortalWebApi.Models;
using System.Threading.Tasks;
using JobPortalWebApi.Repositories;

namespace JobPortalWebApi.Data
{
    // UnitOfWork.cs
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
            JobSeekers = new JobSeekerRepository(_context);
            Recruiters = new RecruiterRepository(_context);
            JobPosts = new JobPostRepository(_context);
            JobCategories = new JobCategoryRepository(_context);  
            JobApplications = new JobApplicationRepository(_context);  
        }
        

        public IJobSeekerRepository JobSeekers { get; private set; }
        public IRecruiterRepository Recruiters { get; private set; }
        public IJobPostRepository JobPosts { get; private set; }
        public IJobCategoryRepository JobCategories { get; private set; }  
        public IJobApplicationRepository JobApplications { get; private set; }

         

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}