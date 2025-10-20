namespace JobPortalWebApi.ViewModels
{
    public class JobCardViewModel
    {
        public int JobId { get; set; }
        public string CompanyLogoUrl { get; set; }
        public string JobTitle { get; set; }
        public string JobType { get; set; }
        public string JobDescription { get; set; }
        public string JobCategory { get; set; }
        public string CompanyAddress { get; set; }
        public string Region { get; set; }
        public string City { get; set; }
        public string  Country{ get; set; }
        public DateTime PostedDate { get; set; }
    }
}