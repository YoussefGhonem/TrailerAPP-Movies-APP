using System.Text;
using System.Net.Mime;
using System;
using System.Web;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Trailer.API.Models;
using Trailer.API.Data;
using Trailer.API.Dtos;
using Trailer.API.Helpers;
using Microsoft.AspNetCore.Http;
using NETCore.MailKit.Core;
using MimeKit;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.WebUtilities;
using AngularToAPI.ModelViews.users;

namespace Trailer.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminRepo _Repo;

        public AdminController(IAdminRepo Repo)
        {
            _Repo = Repo;
        }

        [HttpGet("GetUsers")]
        public async Task<IEnumerable<User>> GetUsers()
        {
            var users = await _Repo.GetUsers();
            if (users == null) return null;
            return users;
        }

        [HttpPost("AddUser")]
        public async Task<IActionResult> AddUser(AddUserModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _Repo.AddUser(model);
                if (user != null) return Ok();
            }
            return BadRequest();
        }
    }
}