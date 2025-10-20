namespace JobPortalWebApi.Models
{
    public class JobCategory
    {
        public int Id { get; set; }
        
        public string CategoryName { get; set; }

        public virtual ICollection<JobPost> JobPosts { get; set; } // one to many relation with job post table
    }
}
