namespace JobPortalWebApi.ViewModels
{
    public class JobDetailViewModel
    {
        public int JobId { get; set; }
        public string JobTitle { get; set; }
        public string JobDescription { get; set; }
        public string JobType { get; set; }
        public string ExperienceLevel { get; set; }
        public int Vacancy { get; set; }
        public string Skills { get; set; }
        public string JobCategory { get; set; }
        public DateTime PostedDate { get; set; }

        public string CompanyName { get; set; }
        public string CompanyWebsite { get; set; }
        public string CompanyDescription { get; set; }
        public string CompanyLogoUrl { get; set; }
        public string CompanyAddress { get; set; }
        public string City { get; set; }
        public string Region { get; set; }
        public string Country { get; set; }
    }
}