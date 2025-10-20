using System.ComponentModel.DataAnnotations;

namespace JobPortalWebApi.ViewModels
{
    public class JobSeekerDetailsViewModel
    { 
        // These fields are for display-only in the form,
        // so they don't need validation attributes.
        public string? UserName { get; set; }
        public string? Email { get; set; }

        // --- Basic Information ---
        [Display(Name = "Profession Title")]
        public string? ProfessionTitle { get; set; }

        [Display(Name = "Location")]
        public string? Location { get; set; }

        [Display(Name = "Age")]
        [Range(18, 99, ErrorMessage = "Age must be between 18 and 99.")]
        public int? Age { get; set; }  

        public string? Bio { get; set; }  

        public IFormFile? ProfileImage { get; set; } // New property for image upload

        // --- Education Information ---
        [Display(Name = "Degree")]
        public string? Degree { get; set; }

        [Display(Name = "Field of Study")]
        public string? FieldOfStudy { get; set; }

        [Display(Name = "Education Description")]
        public string? EducationDescription { get; set; }

        // --- Work Experience Information ---
        [Display(Name = "Company Name")]
        public string? CompanyName { get; set; }

        [Display(Name = "Company Title")]
        public string? CompanyTitle { get; set; }

        [Display(Name = "Experience Description")]
        public string? ExperienceDescription { get; set; }

        // --- Skills ---
        [Display(Name = "Skills")]
        public string? Skills { get; set; }

        [Display(Name = "Profile Picture")]
        public string? ProfilePictureUrl { get; set; }
    }
}