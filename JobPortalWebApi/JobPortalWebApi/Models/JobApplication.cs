using JobPortalWebApi.Data;

namespace JobPortalWebApi.Models
{
    public class JobApplication
    {
        public int Id { get; set; }

        public DateTime AppliedDate { get; set; }

        public string Status { get; set; }

        public int JobSeekerId { get; set; } //foriegn key to job seeker

        public virtual JobSeeker JobSeeker { get; set; }

        public int JobPostId { get; set; } // foriegn key of job post

        public virtual JobPost JobPost { get; set; }

         

    }
}
