using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace JobPortalWebApi.ViewModels
{
    public class CompanyRegistrationViewModel
    {
        // Recruiter (User) Information
        public string RecruiterUsername { get; set; }
        public string RecruiterEmail { get; set; }

        // Company Details
        [Required(ErrorMessage = "Company Name is required.")]
        [StringLength(100, ErrorMessage = "Company Name cannot exceed 100 characters.")]
        [Display(Name = "Company Name")]
        public string CompanyName { get; set; }

        [Url(ErrorMessage = "Please enter a valid URL.")]
        [Display(Name = "Company Website")]
        public string? CompanyWebsite { get; set; }

        [Display(Name = "Company Description")]
        public string? CompanyDescription { get; set; }

        // Company Address Details
        [Required(ErrorMessage = "Address is required.")]
        [StringLength(250, ErrorMessage = "Address cannot exceed 250 characters.")]
        public string Address { get; set; }

        [Required(ErrorMessage = "Phone number is required.")]
        [Phone(ErrorMessage = "Please enter a valid phone number.")]
        public string Phone { get; set; }

        [Required(ErrorMessage = "City is required.")]
        [StringLength(50, ErrorMessage = "City cannot exceed 50 characters.")]
        public string City { get; set; }

        [Required(ErrorMessage = "Region/State is required.")]
        [StringLength(50, ErrorMessage = "Region cannot exceed 50 characters.")]
        public string Region { get; set; }

        [Required(ErrorMessage = "Country is required.")]
        [StringLength(50, ErrorMessage = "Country cannot exceed 50 characters.")]
        public string Country { get; set; }

        [Required(ErrorMessage = "Zip Code is required.")]
        [Display(Name = "Zip Code")]
        [RegularExpression(@"^\d{6}$", ErrorMessage = "Zip Code must be 6 digits.")]
        public string? ZipCode { get; set; }

        [Display(Name = "Company Logo")]
        public IFormFile? CompanyLogoFile { get; set; }

       
        public string? ExistingCompanyLogoPath { get; set; }
    }
}