using JobPortalWebApi.Data;
using JobPortalWebApi.Models;

public static class JobCategoryDataSeeder
{
    public static void SeedCategories(ApplicationDbContext context)
    {
         if (!context.JobCategories.Any())
        {
            var categories = new List<JobCategory>
            {
                new JobCategory { CategoryName = "Finance" },
                new JobCategory { CategoryName = "IT & Engineering" },
                new JobCategory { CategoryName = "Education/Training" },
                new JobCategory { CategoryName = "Art/Design" },
                new JobCategory { CategoryName = "Sale/Marketing" },
                new JobCategory { CategoryName = "Healthcare" },
                new JobCategory { CategoryName = "Science" },
                new JobCategory { CategoryName = "Food Services" }
            };

             context.JobCategories.AddRange(categories);
            context.SaveChanges();
        }
    }
}