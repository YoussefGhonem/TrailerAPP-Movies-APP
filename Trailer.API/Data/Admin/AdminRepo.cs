using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Trailer.API.Models;

namespace Trailer.API.Data
{
    public class AdminRepo : IAdminRepo
    {
        private readonly DataContext _db;
        public AdminRepo(DataContext context)
        {
            _db = context;
        }

        public DataContext Context { get; }

        public async Task<IEnumerable<User>> GetUsers()
        {
            return await _db.Users.ToListAsync();
        }
    }

}