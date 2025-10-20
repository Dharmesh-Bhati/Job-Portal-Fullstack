using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobPortalWebApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class updateRecruiter : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompanyName",
                table: "Recruiters");

            migrationBuilder.RenameColumn(
                name: "location",
                table: "JobPosts",
                newName: "Location");

            migrationBuilder.RenameColumn(
                name: "Experience",
                table: "JobPosts",
                newName: "JobDescription");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "JobPosts",
                newName: "ExperienceLevel");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "CompanyAddresses",
                newName: "CompanyWebsite");

            migrationBuilder.AlterColumn<int>(
                name: "Age",
                table: "JobSeekers",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "CompanyDescription",
                table: "CompanyAddresses",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CompanyLogo",
                table: "CompanyAddresses",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CompanyName",
                table: "CompanyAddresses",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "ZipCode",
                table: "CompanyAddresses",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompanyDescription",
                table: "CompanyAddresses");

            migrationBuilder.DropColumn(
                name: "CompanyLogo",
                table: "CompanyAddresses");

            migrationBuilder.DropColumn(
                name: "CompanyName",
                table: "CompanyAddresses");

            migrationBuilder.DropColumn(
                name: "ZipCode",
                table: "CompanyAddresses");

            migrationBuilder.RenameColumn(
                name: "Location",
                table: "JobPosts",
                newName: "location");

            migrationBuilder.RenameColumn(
                name: "JobDescription",
                table: "JobPosts",
                newName: "Experience");

            migrationBuilder.RenameColumn(
                name: "ExperienceLevel",
                table: "JobPosts",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "CompanyWebsite",
                table: "CompanyAddresses",
                newName: "Email");

            migrationBuilder.AddColumn<string>(
                name: "CompanyName",
                table: "Recruiters",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Age",
                table: "JobSeekers",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }
    }
}
