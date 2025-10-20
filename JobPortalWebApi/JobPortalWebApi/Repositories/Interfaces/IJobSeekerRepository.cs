using JobPortalWebApi.Models;
using System.Threading.Tasks;


namespace JobPortalWebApi.Data
{
    // IJobSeekerRepository.cs
    public interface IJobSeekerRepository : IGenericRepository<JobSeeker>
    {
        Task<JobSeeker> GetByApplicationUserId(string userId);
    }
}