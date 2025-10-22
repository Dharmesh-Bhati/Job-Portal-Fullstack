using JobPortalWebApi.Data;
using JobPortalWebApi.Models;
using JobPortalWebApi.Services.Interfaces;
using JobPortalWebApi.ViewModels;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace JobPortalWebApi.Services
{
    public class RecruiterService : IRecruiterService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly UserManager<ApplicationUser> _userManager;  

        public RecruiterService(IUnitOfWork unitOfWork, IWebHostEnvironment webHostEnvironment, UserManager<ApplicationUser> userManager) // Add UserManager to the constructor
        {
            _unitOfWork = unitOfWork;
            _webHostEnvironment = webHostEnvironment;
            _userManager = userManager;
        }
         

        public async Task<CompanyRegistrationViewModel> GetCompanyRegistrationViewModel(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return null; // User not found
            }

            var existingRecruiter = await _unitOfWork.Recruiters.GetByApplicationUserIdWithCompanyAddress(userId);

             var viewModel = new CompanyRegistrationViewModel
            {
                RecruiterUsername = user.UserName,
                RecruiterEmail = user.Email,
            };

             if (existingRecruiter != null && existingRecruiter.CompanyAddress != null)
            {
                viewModel.CompanyName = existingRecruiter.CompanyAddress.CompanyName;
                viewModel.CompanyWebsite = existingRecruiter.CompanyAddress.CompanyWebsite;
                viewModel.CompanyDescription = existingRecruiter.CompanyAddress.CompanyDescription;
                 viewModel.Address = existingRecruiter.CompanyAddress.Address;
                viewModel.Phone = existingRecruiter.CompanyAddress.Phone;
                viewModel.ZipCode = existingRecruiter.CompanyAddress.ZipCode.ToString();
                viewModel.City = existingRecruiter.CompanyAddress.City;
                viewModel.Region = existingRecruiter.CompanyAddress.Region;
                viewModel.Country = existingRecruiter.CompanyAddress.Country;
                viewModel.ExistingCompanyLogoPath = existingRecruiter.CompanyAddress.CompanyLogo;
            }

             return viewModel;
        }


        public async Task AddOrUpdateCompanyProfile(string userId, CompanyRegistrationViewModel model)
        { 
            var existingRecruiter = await _unitOfWork.Recruiters.GetByApplicationUserIdWithCompanyAddress(userId);
            string? newLogoPath = null;

            
            if (model.CompanyLogoFile != null)
            {
                
                if (existingRecruiter != null && existingRecruiter.CompanyAddress != null && !string.IsNullOrEmpty(existingRecruiter.CompanyAddress.CompanyLogo))
                {
                    var oldLogoPath = Path.Combine(_webHostEnvironment.WebRootPath, existingRecruiter.CompanyAddress.CompanyLogo.TrimStart('/'));
                    if (System.IO.File.Exists(oldLogoPath))
                    {
                        System.IO.File.Delete(oldLogoPath);
                    }
                }

               
                string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images/companylogos");
                Directory.CreateDirectory(uploadsFolder);
                string uniqueFileName = Guid.NewGuid().ToString() + "_" + model.CompanyLogoFile.FileName;
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await model.CompanyLogoFile.CopyToAsync(fileStream);
                }
                newLogoPath = "/images/companylogos/" + uniqueFileName;
            }

            
            if (existingRecruiter != null)
            {
                
                var companyAddressToUpdate = existingRecruiter.CompanyAddress;
                if (companyAddressToUpdate == null)
                {
                    companyAddressToUpdate = new CompanyAddress();
                    existingRecruiter.CompanyAddress = companyAddressToUpdate;  
                }

                
                companyAddressToUpdate.CompanyName = model.CompanyName;
                companyAddressToUpdate.CompanyWebsite = model.CompanyWebsite;
                companyAddressToUpdate.CompanyDescription = model.CompanyDescription;
                companyAddressToUpdate.Address = model.Address;
                companyAddressToUpdate.Phone = model.Phone;
                companyAddressToUpdate.ZipCode = int.TryParse(model.ZipCode, out int zip) ? zip : 0;
                companyAddressToUpdate.City = model.City;
                companyAddressToUpdate.Region = model.Region;
                companyAddressToUpdate.Country = model.Country;

                if (newLogoPath != null)
                {
                    companyAddressToUpdate.CompanyLogo = newLogoPath;
                }
                else if (model.CompanyLogoFile == null && !string.IsNullOrEmpty(model.ExistingCompanyLogoPath))
                {
                     companyAddressToUpdate.CompanyLogo = model.ExistingCompanyLogoPath;
                }
                else if (model.CompanyLogoFile == null && string.IsNullOrEmpty(model.ExistingCompanyLogoPath))
                {
                     companyAddressToUpdate.CompanyLogo = null;
                }

 
                _unitOfWork.Recruiters.Update(existingRecruiter);
            }
            else
            {
                 
                var newRecruiter = new Recruiter
                {
                    ApplicationUserId = userId,
                    CompanyAddress = new CompanyAddress
                    {
                        CompanyName = model.CompanyName,
                        CompanyWebsite = model.CompanyWebsite,
                        CompanyDescription = model.CompanyDescription,
                        Address = model.Address,
                        Phone = model.Phone,
                        ZipCode = int.TryParse(model.ZipCode, out int zip) ? zip : 0,
                        City = model.City,
                        Region = model.Region,
                        Country = model.Country,
                        CompanyLogo = newLogoPath
                    }
                };
                await _unitOfWork.Recruiters.Add(newRecruiter);
            }

           
            await _unitOfWork.CompleteAsync();
        }
    }
}
