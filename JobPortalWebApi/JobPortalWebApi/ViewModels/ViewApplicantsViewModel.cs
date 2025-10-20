 
 using System;
using System.Collections.Generic;

public class ApplicantViewModel
{
     public string ApplicantName { get; set; }
    public string ProfessionTitle { get; set; }
    public string Location { get; set; }
    public DateTime AppliedDate { get; set; }
};

 public class ViewApplicantsViewModel
{
    public int JobId { get; set; }
    public string JobTitle { get; set; }
    public List<ApplicantViewModel> Applicants { get; set; } = new List<ApplicantViewModel>();
};