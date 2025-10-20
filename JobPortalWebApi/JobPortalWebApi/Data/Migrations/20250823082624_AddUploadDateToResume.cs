using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobPortalWebApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddUploadDateToResume : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Resume_JobSeekers_JobSeekerId",
                table: "Resume");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Resume",
                table: "Resume");

            migrationBuilder.RenameTable(
                name: "Resume",
                newName: "Resumes");

            migrationBuilder.RenameIndex(
                name: "IX_Resume_JobSeekerId",
                table: "Resumes",
                newName: "IX_Resumes_JobSeekerId");

            migrationBuilder.AddColumn<DateTime>(
                name: "UploadDate",
                table: "Resumes",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddPrimaryKey(
                name: "PK_Resumes",
                table: "Resumes",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Resumes_JobSeekers_JobSeekerId",
                table: "Resumes",
                column: "JobSeekerId",
                principalTable: "JobSeekers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Resumes_JobSeekers_JobSeekerId",
                table: "Resumes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Resumes",
                table: "Resumes");

            migrationBuilder.DropColumn(
                name: "UploadDate",
                table: "Resumes");

            migrationBuilder.RenameTable(
                name: "Resumes",
                newName: "Resume");

            migrationBuilder.RenameIndex(
                name: "IX_Resumes_JobSeekerId",
                table: "Resume",
                newName: "IX_Resume_JobSeekerId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Resume",
                table: "Resume",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Resume_JobSeekers_JobSeekerId",
                table: "Resume",
                column: "JobSeekerId",
                principalTable: "JobSeekers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
