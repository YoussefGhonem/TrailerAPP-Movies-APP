using System;
using System.IO;
using System.Threading.Tasks;
using Trailer.API.Models;
namespace Trailer.API.Data
{
    public interface IAccountRepository
    {
        
         Task<User>Register(User user,string password);
         Task<User>Login(string UserName,string password);
         Task<bool> UserEmailExists(String Email);
         Task<bool> UserNameExists(String UserName);
        
    }
}