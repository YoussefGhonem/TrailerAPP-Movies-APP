using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using AngularToAPI.ModelViews.users;
using Trailer.API.Models;
namespace Trailer.API.Data
{
    public interface IAdminRepo
    {
        
        public Task<IEnumerable<User>> GetUsers();
         Task<User> AddUser(AddUserModel model);
         Task<User> GetUser(string id );
         Task<User> EditUser(EditUserModel model );
        
    }
}