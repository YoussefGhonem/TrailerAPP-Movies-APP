using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AngularToAPI.ModelViews.users;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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


        public async Task<IEnumerable<User>> GetUsers()
        {
            return await _db.Users.ToListAsync();
        }
    }

}