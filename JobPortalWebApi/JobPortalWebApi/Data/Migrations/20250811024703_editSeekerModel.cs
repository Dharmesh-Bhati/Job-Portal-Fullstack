using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobPortalWebApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class editSeekerModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ResumePath",
                table: "JobSeekers",
                newName: "ProfessionTitle");

            migrationBuilder.RenameColumn(
                name: "Experience",
                table: "JobSeekers",
                newName: "Location");

            migrationBuilder.AddColumn<int>(
                name: "Age",
                table: "JobSeekers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "CompanyName",
                table: "JobSeekers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CompanyTitle",
                table: "JobSeekers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Degree",
                table: "JobSeekers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EducationDescription",
                table: "JobSeekers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ExperienceDescription",
                table: "JobSeekers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FieldOfStudy",
                table: "JobSeekers",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Age",
                table: "JobSeekers");

            migrationBuilder.DropColumn(
                name: "CompanyName",
                table: "JobSeekers");

            migrationBuilder.DropColumn(
                name: "CompanyTitle",
                table: "JobSeekers");

            migrationBuilder.DropColumn(
                name: "Degree",
                table: "JobSeekers");

            migrationBuilder.DropColumn(
                name: "EducationDescription",
                table: "JobSeekers");

            migrationBuilder.DropColumn(
                name: "ExperienceDescription",
                table: "JobSeekers");

            migrationBuilder.DropColumn(
                name: "FieldOfStudy",
                table: "JobSeekers");

            migrationBuilder.RenameColumn(
                name: "ProfessionTitle",
                table: "JobSeekers",
                newName: "ResumePath");

            migrationBuilder.RenameColumn(
                name: "Location",
                table: "JobSeekers",
                newName: "Experience");
        }
    }
}
