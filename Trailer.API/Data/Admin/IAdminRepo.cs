using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Trailer.API.Models;
namespace Trailer.API.Data
{
    public interface IAdminRepo
    {
        
        public Task<IEnumerable<User>> GetUsers();
        
    }
}