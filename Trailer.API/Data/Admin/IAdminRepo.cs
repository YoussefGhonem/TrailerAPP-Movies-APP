using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using AngularToAPI.Models;
using AngularToAPI.ModelViews.users;
using Trailer.API.Dtos;
using Trailer.API.Models;
namespace Trailer.API.Data
{
    public interface IAdminRepo
    {

        Task<IEnumerable<User>> GetUsers();
        Task<User> AddUser(AddUserModel model);
        Task<User> GetUser(string id);
        Task<User> EditUser(EditUserModel model);
        Task<bool> DeleteUserList(List<string> ids);
        Task<IEnumerable<UserRolesModel>> GetUserRoles();
        Task<IEnumerable<Role>> GetRolesc();
        Task<bool> EditUserRole(EditUserRoleModel model);
        Task<IEnumerable<Category>> GetCategories();
        Task<bool> DaleteAllCategory(List<string> ids);
        Task<Category> AddCategory(AddCategoryDto model);
        Task<Category> GetCategory(int id);
        Task<bool> SaveAll();

    }
}