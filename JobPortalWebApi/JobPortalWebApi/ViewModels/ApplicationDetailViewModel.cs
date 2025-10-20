 
using System;

public class ApplicationDetailViewModel
{
    // ... basic application fields
    public int Id { get; set; }
    public string Status { get; set; }
    public DateTime AppliedDate { get; set; }
    public string JobTitle { get; set; }  

    // JobSeeker Info
    public string ApplicantUserName { get; set; }  
    public string ApplicantEmail { get; set; }     
    public string ProfessionTitle { get; set; }
    public string Location { get; set; }
    public string Bio { get; set; }
    public string Skills { get; set; }
    public string EducationDescription { get; set; }
    public string ProfilePicture { get; set; }
}