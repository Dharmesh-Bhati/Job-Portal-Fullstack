using System;
using System.Collections.Generic;

public class ManageJobViewModel
{
    public int Id { get; set; }
    public string JobTitle { get; set; }
    public string Location { get; set; }
    public int Vacancy { get; set; }
    public DateTime PostedDate { get; set; }

     public string JobType { get; set; } 
    public int TotalApplications { get; set; } 

    public List<JobApplicationSummaryViewModel> Applications { get; set; }
}

public class JobApplicationSummaryViewModel
{
    public int ApplicationId { get; set; }
    public string Status { get; set; }
}