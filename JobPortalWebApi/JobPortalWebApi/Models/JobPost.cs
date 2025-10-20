namespace JobPortalWebApi.Models
{
    public class JobPost
    {
        public int Id { get; set; }

        public string JobTitle { get; set; }

        public string JobType { get; set; }

        public string ExperienceLevel { get; set; }

        public int Vacancy { get; set; }

        public string Location { get; set; }

        public string Skills { get; set; }

        public string JobDescription { get; set; }

        public  DateTime PostedDate { get; set; }

        // foreign key 
        public int RecruiterId { get; set; }
        public int JobCategoryId { get; set; }  

        //navigation
        public virtual Recruiter Recruiter { get; set; } 
        public virtual JobCategory JobCategory { get; set; }  

        public virtual ICollection<JobApplication> JobApplications { get; set; }  // Many-to-many relationship through JobApplication

    }
}
