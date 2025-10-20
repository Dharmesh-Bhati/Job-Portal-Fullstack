using JobPortalWebApi.Models;
using Microsoft.AspNetCore.Identity;

namespace JobPortalWebApi.Data
{
    public class ApplicationUser: IdentityUser 
    {
        public virtual Recruiter Recruiter { get; set; } //one to one relationship with recruiter coz application user ya to recruiter hoga ya job seeker.
        public virtual JobSeeker JobSeeker { get; set; } //one to one relationship with jobseeker

         
    }
}
