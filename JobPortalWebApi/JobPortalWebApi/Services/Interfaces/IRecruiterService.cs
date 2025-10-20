using JobPortalWebApi.ViewModels;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using JobPortalWebApi.Models;

namespace JobPortalWebApi.Services.Interfaces
{
    public interface IRecruiterService
    {
        Task<CompanyRegistrationViewModel> GetCompanyRegistrationViewModel(string userId);
        Task AddOrUpdateCompanyProfile(string userId, CompanyRegistrationViewModel model);
    }
}