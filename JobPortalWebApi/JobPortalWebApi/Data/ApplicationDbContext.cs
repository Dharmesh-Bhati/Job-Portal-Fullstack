using JobPortalWebApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace JobPortalWebApi.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<JobSeeker> JobSeekers { get; set; }
        public DbSet<Recruiter> Recruiters { get; set; }
        public DbSet<JobPost> JobPosts { get; set; }
        public DbSet<CompanyAddress> CompanyAddresses { get; set; }
        public DbSet<JobApplication> JobApplications { get; set; }
        public DbSet<JobCategory> JobCategories { get; set; }
        

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // One-to-One: ApplicationUser -> Recruiter
            modelBuilder.Entity<Recruiter>()
                .HasOne(r => r.ApplicationUser)
                .WithOne(a => a.Recruiter) // WithOne() should be WithOne(a => a.Recruiter)
                .HasForeignKey<Recruiter>(r => r.ApplicationUserId);

            // One-to-One: ApplicationUser -> JobSeeker
            modelBuilder.Entity<JobSeeker>()
                .HasOne(js => js.ApplicationUser)
                .WithOne(a => a.JobSeeker)
                .HasForeignKey<JobSeeker>(js => js.ApplicationUserId);

            // One-to-Many: Recruiter -> JobPost
            modelBuilder.Entity<JobPost>()
                .HasOne(jp => jp.Recruiter)
                .WithMany(r => r.JobPosts)
                .HasForeignKey(jp => jp.RecruiterId);

            // One-to-Many: JobCategory -> JobPost
            modelBuilder.Entity<JobPost>()
                .HasOne(jp => jp.JobCategory)
                .WithMany(jc => jc.JobPosts)
                .HasForeignKey(jp => jp.JobCategoryId);

            // One-to-One: Recruiter -> CompanyAddress
            modelBuilder.Entity<CompanyAddress>()
                .HasOne(ca => ca.Recruiter)
                .WithOne(r => r.CompanyAddress)
                .HasForeignKey<CompanyAddress>(ca => ca.RecruiterId);

            // Many-to-Many: JobPost <-> JobSeeker (via JobApplication)
            modelBuilder.Entity<JobApplication>()
                .HasOne(ja => ja.JobSeeker)
                .WithMany(js => js.JobApplications)
                .HasForeignKey(ja => ja.JobSeekerId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<JobApplication>()
                .HasOne(ja => ja.JobPost)
                .WithMany(jp => jp.JobApplications)
                .HasForeignKey(ja => ja.JobPostId)
                .OnDelete(DeleteBehavior.NoAction);

           
        }
    }
}
