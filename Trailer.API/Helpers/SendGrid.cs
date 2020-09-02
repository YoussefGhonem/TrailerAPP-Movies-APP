
using System.Threading.Tasks;
using SendGrid;
using SendGrid.Helpers.Mail;


namespace Trailer.API.Helpers
{
    public static class SendGridAPI
    {
    public static async Task <bool> Execute(string UserEmail,string UseerName,string plainTextContent,
      string htmlContent, string subject)
        {
            var apiKey ="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";
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("ymg1234567891011@gmail.com", "Trailer");
            var to = new EmailAddress(UserEmail, UseerName);
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);
            return await Task.FromResult(true);
        }
    }
}