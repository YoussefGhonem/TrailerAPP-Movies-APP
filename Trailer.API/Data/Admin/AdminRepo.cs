using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AngularToAPI.Models;
using AngularToAPI.ModelViews.users;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Trailer.API.Dtos;
using Trailer.API.Models;

namespace Trailer.API.Data
{
    public class AdminRepo : IAdminRepo
    {
        private readonly DataContext _db;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;

        public AdminRepo(DataContext context, IMapper mapper, UserManager<User> userManager, RoleManager<Role> roleManager)
        {
            _db = context;
            _mapper = mapper;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public DataContext Context { get; }

        public async Task<User> AddUser(AddUserModel model)
        {
            if (model == null) return null;
            var userCreate = _mapper.Map<User>(model);
            var result = await _userManager.CreateAsync(userCreate, model.Password);
            if (result.Succeeded)
            {
                if (await _roleManager.RoleExistsAsync("User"))
                {
                    if (!await _userManager.IsInRoleAsync(userCreate, "User") && !await _userManager.IsInRoleAsync(userCreate, "Admin"))
                    {
                        await _userManager.AddToRoleAsync(userCreate, "User");
                    }
                }
                return userCreate;
            }
            return null;
        }

        public async Task<bool> DeleteUserList(List<string> ids)
        {
            if (ids.Count < 1)
            {
                return false;
            }
            var i = 0;
            foreach (string id in ids)
            {
                var user = await _db.Users.FirstOrDefaultAsync(x => x.Id == id);
                if (user == null)
                {
                    return false;
                }
                _db.Users.Remove(user);
                i++;
            }
            if (i > 0)
            {
                await _db.SaveChangesAsync();
            }
            return true;
        }

        public async Task<User> EditUser(EditUserModel model)
        {
            if (model.Id == null)
            {
                return null;
            }

            var user = await _db.Users.FirstOrDefaultAsync(x => x.Id == model.Id);
            if (user == null)
            {
                return null;
            }

            if (model.Password != user.PasswordHash)
            {
                var result = await _userManager.RemovePasswordAsync(user);
                if (result.Succeeded)
                {
                    await _userManager.AddPasswordAsync(user, model.Password);
                }
            }

            _db.Users.Attach(user);
            user.Email = model.Email;
            user.UserName = model.UserName;
            user.EmailConfirmed = model.EmailConfirmed;
            user.PhoneNumber = model.PhoneNumber;
            user.Country = model.Country;

            _db.Entry(user).Property(x => x.Email).IsModified = true;
            _db.Entry(user).Property(x => x.UserName).IsModified = true;
            _db.Entry(user).Property(x => x.EmailConfirmed).IsModified = true;
            _db.Entry(user).Property(x => x.PhoneNumber).IsModified = true;
            _db.Entry(user).Property(x => x.Country).IsModified = true;
            await _db.SaveChangesAsync();
            return user;
        }

        public async Task<User> GetUser(string id)
        {
            if (id == null)
            {
                return null;
            }

            var user = await _db.Users.FirstOrDefaultAsync(x => x.Id == id);
            if (user == null)
            {
                return null;
            }
            return user;
        }

        public async Task<IEnumerable<UserRolesModel>> GetUserRoles()
        {
            var query = await (
                from userRole in _db.UserRoles
                join users in _db.Users
                on userRole.UserId equals users.Id
                join roles in _db.Roles
                on userRole.RoleId equals roles.Id
                select new
                {
                    userRole.UserId,
                    userRole.RoleId,
                    users.UserName,
                    roles.Name
                }).ToListAsync();
            List<UserRolesModel> userRolesModels = new List<UserRolesModel>();
            if (query.Count > 0)
            {
                for (int i = 0; i < query.Count; i++)
                {
                    var model = new UserRolesModel
                    {
                        UserId = query[i].UserId,
                        UserName = query[i].UserName,
                        RoleId = query[i].RoleId,
                        RoleName = query[i].Name
                    };
                    userRolesModels.Add(model);
                }
            }
            return userRolesModels;
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            return await _db.Users.ToListAsync();
        }

        public async Task<IEnumerable<Role>> GetRolesc()
        {
            return await _db.Roles.ToListAsync();
        }

        public async Task<bool> EditUserRole(EditUserRoleModel model)
        {
            if (model.UserId == null || model.RoleId == null)
            {
                return false;
            }
            var user = await _db.Users.FirstOrDefaultAsync(x => x.Id == model.UserId);
            if (user == null)
            {
                return false;
            }

            var currentRoleId = await _db.UserRoles.Where(x => x.UserId == model.UserId).Select(x => x.RoleId).FirstOrDefaultAsync();
            var currentRoleName = await _db.Roles.Where(x => x.Id == currentRoleId).Select(x => x.Name).FirstOrDefaultAsync();
            var newRoleName = await _db.Roles.Where(x => x.Id == model.RoleId).Select(x => x.Name).FirstOrDefaultAsync();

            if (await _userManager.IsInRoleAsync(user, currentRoleName))
            {

                var x = await _userManager.RemoveFromRoleAsync(user, currentRoleName);
                if (x.Succeeded)
                {
                    var s = await _userManager.AddToRoleAsync(user, newRoleName);
                    if (s.Succeeded)
                    {
                        return true;
                    }
                }
            }

            return false;
        }

        public async Task<IEnumerable<Category>> GetCategories()
        {
            return await _db.Categories.ToListAsync();
        }

        public async Task<bool> DaleteAllCategory(List<string> ids)
        {
            if (ids.Count < 0) {return false;}

            var i = 0;
            foreach (string id in ids)
            {
                var Category = await _db.Categories.FirstOrDefaultAsync(x => x.Id.ToString() == id);
                if (Category == null)
                {
                    return false;
                }
                _db.Categories.Remove(Category);
                i++;               
            }
             if (i > 0){ await _db.SaveChangesAsync();}
            return true;
        }

        public async Task<Category> AddCategory(AddCategoryDto model)
        {
            if(model==null)return null;
            var Category=_mapper.Map<Category>(model);
            var result=await _db.Categories.AddAsync(Category);
            await _db.SaveChangesAsync();
            return Category;
        }

        public async Task<Category> GetCategory(EditCategoryDto model)
        {
           // if(model.Id==null)return null;
            var category=await _db.Categories.FirstOrDefaultAsync(x=>x.Id==model.Id);
            if(category==null)return null;
            return category;
        }

        public async Task<Category> GetCategory(int id)
        {
             var category = await _db.Categories.FirstOrDefaultAsync(x => x.Id == id); 
            return category;

        }
    
         public async Task<bool> SaveAll()
        {
            return await _db.SaveChangesAsync() > 0;
        }
    }

}