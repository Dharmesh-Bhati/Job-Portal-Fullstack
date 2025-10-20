namespace JobPortalWebApi.Models
{
    public class CompanyAddress
    {
        public int Id { get; set; }

        public string CompanyName { get; set; }

        public string CompanyWebsite { get; set; }

        public string CompanyDescription { get; set; }

        public string Address { get; set; }

        public string Phone { get; set; }

        public int ZipCode { get; set; }

        public string City { get; set; }

        public string Region { get; set; }


        public string Country { get; set; }

        public string CompanyLogo { get; set; }

        public int RecruiterId { get; set; }
        public virtual Recruiter Recruiter { get; set; }
    }
}
