using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ModelBinding; // Required for [BindNever]

namespace JobPortalWebApi.ViewModels
{
    public class EditJobViewModel
    {
        // The ID is crucial for identifying the job to update
        public int JobId { get; set; }

        [Required(ErrorMessage = "Job Title is required")]
        public string JobTitle { get; set; }

        [Required(ErrorMessage = "Job Type is required")]
        public string JobType { get; set; }

        [Required(ErrorMessage = "Category is required")]
        public int JobCategoryId { get; set; }

        [Required(ErrorMessage = "Experience is required")]
        public string Experience { get; set; }

        [Required(ErrorMessage = "Vacancy is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Vacancy must be at least 1")]
        public int Vacancy { get; set; }

        public string Location { get; set; }

        public string Skills { get; set; }

        public string Description { get; set; }

        public DateTime PostedDate { get; set; }

        [BindNever]
        public List<SelectListItem>? AvailableCategories { get; set; }
    }    
};