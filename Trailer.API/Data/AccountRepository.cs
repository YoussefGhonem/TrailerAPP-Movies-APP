using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Trailer.API.Models;

namespace Trailer.API.Data
{
    public class AccountRepository : IAccountRepository
    {
        private readonly DataContext _context;

        public AccountRepository(DataContext context)
        {
            _context = context;

        }

        public Task<User> Login(string UserName, string password)
        {
            throw new System.NotImplementedException();
        }

        public Task<User> Register(User user, string password)
        {
            throw new System.NotImplementedException();
        }

     
        public async Task<bool> UserNameExists(string UserName)
        {
             if (await _context.Users.AnyAsync(x => x.UserName == UserName))return true;
            return false;
        }

        public async Task<bool> UserEmailExists(string Email)
        {
            if (await _context.Users.AnyAsync(x => x.Email == Email))return true;
            return false;      
              }
    }
}