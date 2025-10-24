using MailKit.Net.Smtp;
using MimeKit;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using JobPortalWebApi.Services.Interfaces;
using Microsoft.Extensions.Logging; // ILogger के लिए यह नया 'using' जोड़ा गया है

namespace JobPortalWebApi.Services.Interfaces
{
    public class EmailSender : IEmailSender
    {
        private readonly IConfiguration _config;
        private readonly ILogger<EmailSender> _logger;  

         
        public EmailSender(IConfiguration config, ILogger<EmailSender> logger)
        {
            _config = config;
            _logger = logger;
        }

        public Task SendEmailAsync(string email, string subject, string message)
        {
            // ----------------------------------------------------------------------
            // RENDER/SMTP FIX: Temporarily disable MailKit connection attempt 
            // to resolve System.TimeoutException on Render.
            // ----------------------------------------------------------------------

            _logger.LogWarning($"EMAIL SIMULATION: To: {email}, Subject: {subject}. Real email sending disabled.");
 
            return Task.CompletedTask;

            // ----------------------------------------------------------------------
            /* // Original MailKit code (commented out):
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress("JobPortal", _config["Smtp:UserName"]));
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
            */
        }
    }
}
