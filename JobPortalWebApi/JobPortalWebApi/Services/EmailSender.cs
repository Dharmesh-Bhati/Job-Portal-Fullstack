  
using MailKit.Net.Smtp;
using MimeKit;
using MailKit.Security;
using Microsoft.Extensions.Configuration;

namespace JobPortalWebApi.Services.Interfaces
{
    public class EmailSender : IEmailSender
    {
        private readonly IConfiguration _config;

        public EmailSender(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string email, string subject, string message)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress("JobPortal", _config["Smtp:UserName"]));

            // FIX: This line correctly sets the recipient's email.
            // If emails are still going to your own Gmail, the problem
            // is with your SMTP provider's settings (not allowing relay).
            emailMessage.To.Add(new MailboxAddress("", email));

            emailMessage.Subject = subject;
            emailMessage.Body = new TextPart("html") { Text = message };

            using (var client = new SmtpClient())
            {
                await client.ConnectAsync(_config["Smtp:Host"], int.Parse(_config["Smtp:Port"]), SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(_config["Smtp:UserName"], _config["Smtp:Password"]);
                await client.SendAsync(emailMessage);
                await client.DisconnectAsync(true);
            }
        }
    }
}

//using SendGrid;
//using SendGrid.Helpers.Mail;
//using Microsoft.Extensions.Configuration;
//using JobPortalWebApi.Services.Interfaces;
//using System.Threading.Tasks;
//using System;

//namespace JobPortalWebApi.Services
//{
//    // Ab hum IEmailSender interface ko implement karne ke liye SendGrid ka upyog karenge.
//    public class EmailSender : IEmailSender
//    {
//        private readonly IConfiguration _config;

//        public EmailSender(IConfiguration config)
//        {
//            _config = config;
//        }

//        public async Task SendEmailAsync(string email, string subject, string message)
//        {
//            // SendGrid API key ko appsettings.json se padhein.
//            var apiKey = _config["SendGrid:ApiKey"];
//            if (string.IsNullOrEmpty(apiKey))
//            {
//                throw new InvalidOperationException("SendGrid API key not found in configuration.");
//            }

//            var client = new SendGridClient(apiKey);

//            // NOTE: Yeh "fromEmail" address aapko SendGrid dashboard mein verify karna hoga.
//            // Jab aap SendGrid use karte hain, to aapka from email yahi hoga.
//            // "your_verified_sender@example.com" ko ek real, verified email se badal dein.
//            var fromEmail = new EmailAddress("your_verified_sender@gmail.com", "JobPortal");
//            var toEmail = new EmailAddress(email);
//            var msg = MailHelper.CreateSingleEmail(fromEmail, toEmail, subject, "", message);

//            try
//            {
//                var response = await client.SendEmailAsync(msg);
//                if (response.IsSuccessStatusCode)
//                {
//                    Console.WriteLine("Email successfully sent via SendGrid.");
//                }
//                else
//                {
//                    Console.WriteLine($"Failed to send email. Status code: {response.StatusCode}");
//                    var body = await response.Body.ReadAsStringAsync();
//                    Console.WriteLine($"Response body: {body}");
//                }
//            }
//            catch (Exception ex)
//            {
//                Console.WriteLine($"An error occurred: {ex.Message}");
//            }
//        }
//    }
//}
