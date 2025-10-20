using JobPortalWebApi.Data;

namespace JobPortalWebApi.Models
{
    public class Recruiter
    {
        public int Id { get; set; }

        public string ApplicationUserId { get; set; } // foreign key main parent

        public virtual ApplicationUser ApplicationUser { get; set; } // ref of a parent table to access parent user(application user)


        public virtual CompanyAddress CompanyAddress { get; set; }

        public virtual ICollection<JobPost> JobPosts { get; set; } // one to many relationship coz one recruiter many job posts kr skta.
    }
}
