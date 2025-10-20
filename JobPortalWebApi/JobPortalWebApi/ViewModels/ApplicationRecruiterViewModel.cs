 
 using System;

public class ApplicationRecruiterViewModel
{
    // Application ID (for View Details link)
    public int Id { get; set; }

    // Application Status
    public string Status { get; set; }
    public DateTime AppliedDate { get; set; }

    // Applicant Details
    public string ApplicantName { get; set; }
    public string ProfessionTitle { get; set; }
    public string ProfilePicture { get; set; } // Required for Image URL

    // Job Post Details  
    public string JobTitle { get; set; }
}

 