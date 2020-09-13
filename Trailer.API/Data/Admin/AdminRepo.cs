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
        private readonly IMapper  _mapper;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;

        public AdminRepo(DataContext context,IMapper mapper, UserManager<User> userManager,RoleManager<Role>roleManager)
        {
            _db = context;
            _mapper = mapper;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public DataContext Context { get; }

        public async Task<User> AddUser(AddUserModel model)
        {
           if(model==null)return null;
            var userCreate=_mapper.Map<User>(model);
            var result=await _userManager.CreateAsync(userCreate,model.Password);
            if(result.Succeeded){
                    if(await _roleManager.RoleExistsAsync("User")){
                        if(!await _userManager.IsInRoleAsync(userCreate,"User")&&!await _userManager.IsInRoleAsync(userCreate,"Admin")){
                            await _userManager.AddToRoleAsync(userCreate, "User");
                        }
                    }
                    return userCreate;
            }
            return null;
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            return await _db.Users.ToListAsync();
        }
    }

}