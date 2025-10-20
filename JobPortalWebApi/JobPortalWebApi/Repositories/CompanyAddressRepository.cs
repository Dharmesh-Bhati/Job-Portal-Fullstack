using JobPortalWebApi.Models;
using JobPortalWebApi.Repositories;

namespace JobPortalWebApi.Data
{
    public class CompanyAddressRepository : GenericRepository<CompanyAddress>, ICompanyAddressRepository
    {
        public CompanyAddressRepository(ApplicationDbContext context) : base(context) { }
    }
}