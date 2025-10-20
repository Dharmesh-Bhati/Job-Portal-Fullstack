using JobPortalWebApi.Data;
using JobPortalWebApi.Models;

public interface IRecruiterRepository : IGenericRepository<Recruiter>
{
    Task<Recruiter> GetByApplicationUserIdAsync(string userId);
    Task<Recruiter> GetByApplicationUserIdWithCompanyAddress(string userId);
}