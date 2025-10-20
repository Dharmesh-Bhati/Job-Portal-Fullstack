using JobPortalWebApi.Data;

namespace JobPortalWebApi.Models
{
    public class JobSeeker
    {
        public int Id { get; set; }

        // Core Profile Information
        public string? ProfessionTitle { get; set; }
        public string? Bio { get; set; }
        public string? Location { get; set; }
        public int? Age { get; set; }
        public string? Skills { get; set; }

        public string? ProfilePicture { get; set; }

        // Education Information
        public string? Degree { get; set; }
        public string? FieldOfStudy { get; set; }
        public string? EducationDescription { get; set; }

        // Work Experience Information
        public string? CompanyName { get; set; }
        public string? CompanyTitle { get; set; }
        public string? ExperienceDescription { get; set; }


        public string ApplicationUserId { get; set; }

        public virtual ApplicationUser ApplicationUser { get; set; }

        public ICollection<JobApplication> JobApplications { get; set; }


    }
}
