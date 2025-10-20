using Microsoft.AspNetCore.Mvc.Rendering;
using System.ComponentModel.DataAnnotations;

namespace JobPortalWebApi.ViewModels
{
    public class PostJobViewModel
    {
        
        // Job Details fields from the form
        [Required]
        [Display(Name = "Job Title")]
        public string JobTitle { get; set; }

        [Required]
        [Display(Name = "Job Type")]
        public string JobType { get; set; }

        // Note: The form uses "Experience", so the ViewModel should match.
        [Required]
        [Display(Name = "Experience Level")]
        public string Experience { get; set; }

        [Required]
        [Display(Name = "Category")]
        public int JobCategoryId { get; set; }

        [Required]
        [Display(Name = "Vacancy")]
        [Range(1, int.MaxValue, ErrorMessage = "Vacancy must be at least 1.")]
        public int Vacancy { get; set; }

        public string Location { get; set; }

        public string Skills { get; set; }

        // Note: The form uses "Description", so the ViewModel should match.
        [Display(Name = "Job Description")]
        public string Description { get; set; }
         

        // Note: The form uses "ClosingDate", so the ViewModel should match.
        [Display(Name = "Posted Date / Closing Date")]
        public DateTime? PostedDate { get; set; }

        // This is for the dropdown in the GET action
          public List<SelectListItem> AvailableCategories { get; set; } = new List<SelectListItem>();
    }
}

