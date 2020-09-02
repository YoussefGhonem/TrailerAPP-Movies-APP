using System.Linq;
using System.Threading.Tasks;
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

        public  bool UserEmailExists(string Email)
        {
             if( _context.Users.Any(x=>x.Email==Email))return true;
            return false;
        }
           public  bool UserNameExists(string UserName)
        {
             if( _context.Users.Any(x=>x.UserName==UserName))return true;
            return false;
        }
    }
}