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

namespace Trailer.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    // [Authorize]
    public class AccountController : ControllerBase
    {

        private readonly IAccountRepository _Repo;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        private readonly IEmailService _iEmailService;
        private readonly SignInManager<User> _signInManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly DataContext _db;

        public AccountController(DataContext db, IAccountRepository Repo, UserManager<User> userManager, IMapper mapper,
        IEmailService iEmailService, SignInManager<User> signInManager, RoleManager<Role> roleManager)
        {
            _db = db;
             _Repo = Repo;
            _mapper = mapper;
            _iEmailService = iEmailService;
            _signInManager = signInManager;
            _userManager = userManager;
            _roleManager = roleManager;

        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDto userRegisterDto)
        {
            if (userRegisterDto == null) { return NotFound(); }
            if (ModelState.IsValid)
            {
                if (await _Repo.UserEmailExists(userRegisterDto.Email))
                {
                    return BadRequest("email is Taken Before");
                }
                if (await _Repo.UserNameExists(userRegisterDto.UserName))
                {
                    return BadRequest("UserName is Taken Before");
                }
                var userToCreate = _mapper.Map<User>(userRegisterDto);
                var result = await _userManager.CreateAsync(userToCreate, userRegisterDto.Password);
                if (result.Succeeded)
                {
                    // 1-Generate Token
                    var token = await _userManager.GenerateEmailConfirmationTokenAsync(userToCreate);

                    // var ConfirmLink = Url.Action("RegistrationConfirm", "Account", new
                    // {
                    //     ID = userToCreate.Id,
                    //     Token = HttpUtility.UrlEncode(token)
                    // }, Request.Scheme, Request.Host.ToString());
                    // 1- Send Confirmation Link To Angular
                    var encodeToken = Encoding.UTF8.GetBytes(token);
                    var newToken = WebEncoders.Base64UrlEncode(encodeToken);
                    var ConfirmLinkUI = $"http://localhost:4200/registerconfirm?ID={userToCreate.Id}&Token={newToken}";

                    try
                    {
                        var message = new MimeMessage();
                        message.From.Add(new MailboxAddress("Trailer Site", "youssef.fcih@gmail.com"));
                        message.To.Add(new MailboxAddress(userToCreate.UserName, userToCreate.Email));
                        message.Subject = "My First Email";
                        message.Body = new TextPart("plain")
                        {
                            Text = ConfirmLinkUI
                        };
                        using (var client = new MailKit.Net.Smtp.SmtpClient())
                        {
                            client.Connect("smtp.gmail.com", 587, false);
                            //SMTP server authentication if needed
                            client.Authenticate("ymg1234567891011@gmail.com", "03@fcih@FCIH@");
                            client.Send(message);
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.Message);
                        return BadRequest(ex.Message);
                    }
                    return Ok(StatusCodes.Status200OK);
                }
                else
                {
                    return BadRequest(result.Errors);
                }
            }
            return StatusCode(StatusCodes.Status404NotFound);
        }

        [HttpGet("RegistrationConfirm")]
        public async Task<IActionResult> RegistrationConfirm(string id, string Token)
        {
            if (String.IsNullOrEmpty(id) || String.IsNullOrEmpty(Token))
                return NotFound();
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound();

            // Send Confirmation Link To Angular
            var newToken = WebEncoders.Base64UrlDecode(Token);
            var encodeToken = Encoding.UTF8.GetString(newToken);

            var result = await _userManager.ConfirmEmailAsync(user, encodeToken);
            if (result.Succeeded)
                return Ok();
            else
                return BadRequest(result.Errors);
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto userLoginDto)
        {
            // 3- Roles
            await CreateRoles();
            await CreateAdmin();

            if (userLoginDto == null)
                return NotFound();
            var user = await _userManager.FindByEmailAsync(userLoginDto.Email);
            if (user == null)
                return NotFound("Email or Password Not Found Please Try Again");
            // if (user.PasswordHash != userLoginDto.Password)
            //     return NotFound("Password Not Found Please Try Again");
            if (!user.EmailConfirmed) // if user not confirm his email
                return Unauthorized("Email not confirm yet");

            var userName = HttpContext.User.Identity.Name;
            var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (id != null || userName != null)
            {
                return BadRequest($"user id:{userName} is exists");
            }

            var result = await _signInManager.PasswordSignInAsync(user, userLoginDto.Password, userLoginDto.RememberMe, false);
            if (result.Succeeded)
            {
                // 4- Roles
                if (await _roleManager.RoleExistsAsync("User"))
                {
                    if (!await _userManager.IsInRoleAsync(user, "User") && !await _userManager.IsInRoleAsync(user, "Admin"))
                    {
                        await _userManager.AddToRoleAsync(user, "User");
                    }
                }

                var roleName = await GetRoleNameByUserId(user.Id);
                if (roleName != null)            
               {
                    HttpContext.Response.Cookies.Append(
                     "name", "value",
                     new CookieOptions() { SameSite = SameSiteMode.Lax });
                     AddCookies(user.UserName, roleName, user.Id, userLoginDto.RememberMe, user.Email);
                }
                return Ok();
            }
            else if (result.IsLockedOut)
            {
                return Unauthorized("the account has been temporarily blocked");
            }
            // return StatusCode(StatusCodes.Status204NoContent);
            return NotFound("Password Not Found Please Try Again");
        }

        [HttpGet("GetRoleName/{email}")] // علشان تجيب قيميه الصلاحيه
        public async Task<string> GetRoleName(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user != null)
            {
                var userRole = await _db.UserRoles.FirstOrDefaultAsync(x => x.UserId == user.Id);
                if (userRole != null)
                {
                    return await _db.Roles.Where(x => x.Id == userRole.RoleId).Select(x => x.Name).FirstOrDefaultAsync();
                }
            }
            return null;
        }

        // [Authorize]
        [HttpGet("CheckUserClaims/{email}/{role}")]      // get Email Cliam   
        public IActionResult CheckUserClaims(string email, string role)
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            if (userEmail != null && userRole != null && id != null)
            {
                if (email == userEmail && role == userRole)
                {
                    return Ok();
                }
            }
            return StatusCode(StatusCodes.Status404NotFound);
        }

        [HttpGet("Logout")]
        public async Task<IActionResult> Logout()
        {
            var authProperties = new AuthenticationProperties
            {
                AllowRefresh = true,
                IsPersistent = true,
                ExpiresUtc = DateTime.UtcNow.AddDays(10)
            };
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme, authProperties);
            return Ok();
        }

        // 5- Roles
        private async Task<string> GetRoleNameByUserId(string userId)
        {
            var userRole = await _db.UserRoles.FirstOrDefaultAsync(x => x.UserId == userId);
            if (userRole != null)
            {
                return await _db.Roles.Where(x => x.Id == userRole.RoleId).Select(x => x.Name).FirstOrDefaultAsync();
            }
            return null;
        }
        // 6- Roles
        private async void AddCookies(string username, string roleName, string userId, bool remember, string email)
        {
            var claim = new List<Claim>
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Email, email), // Set Email Claim
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.Role, roleName),
            };
            var claimIdentity = new ClaimsIdentity(claim, CookieAuthenticationDefaults.AuthenticationScheme);

            if (remember)
            {
                var authProperties = new AuthenticationProperties
                {
                    AllowRefresh = true,
                    IsPersistent = true,
                    ExpiresUtc = DateTime.UtcNow.AddDays(10)
                };

                await HttpContext.SignInAsync
                (
                   CookieAuthenticationDefaults.AuthenticationScheme,
                   new ClaimsPrincipal(claimIdentity),
                   authProperties
                );
            }
            else
            {
                var authProperties = new AuthenticationProperties
                {
                    AllowRefresh = true,
                    IsPersistent = false,
                    ExpiresUtc = DateTime.UtcNow.AddMinutes(30)
                };

                await HttpContext.SignInAsync
                (
                   CookieAuthenticationDefaults.AuthenticationScheme,
                   new ClaimsPrincipal(claimIdentity),
                   authProperties
                );
            }
        }

        // 1- Roles
        private async Task CreateAdmin()
        {
            var admin = await _userManager.FindByNameAsync("Admin");
            if (admin == null)
            {
                var user = new User
                {
                    Email = "admin@admin.com",
                    UserName = "Admin",
                    PhoneNumber = "0796544854",
                    EmailConfirmed = true
                };

                var x = await _userManager.CreateAsync(user, "123#Aa");
                if (x.Succeeded)
                {
                    if (await _roleManager.RoleExistsAsync("Admin"))
                        await _userManager.AddToRoleAsync(user, "Admin");
                }
            }
        }
        // 2- Roles
        private async Task CreateRoles()
        {
            if (_roleManager.Roles.Count() < 1)
            {
                var role = new Role
                {
                    Name = "Admin"
                };
                await _roleManager.CreateAsync(role);

                role = new Role
                {
                    Name = "User"
                };
                await _roleManager.CreateAsync(role);
            }
        }


        [HttpGet("emailexits")]
        public async Task<IActionResult> emailexits(String email)
        {
            var user = await _Repo.UserEmailExists(email);
            if (user)
            {
                return StatusCode(StatusCodes.Status200OK);
            }
            return StatusCode(StatusCodes.Status400BadRequest);
        }

        [HttpGet("usernameexits")]
        public async Task<IActionResult> usernameexits(String username)
        {
            var user = await _Repo.UserNameExists(username);
            if (user)
            {
                return StatusCode(StatusCodes.Status200OK);
            }
            return StatusCode(StatusCodes.Status400BadRequest);
        }

        [HttpGet("ForgetPassword/{email}")]
        public async Task<IActionResult> ForgetPassword(String email)
        {
            if (email == null) return NotFound();

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) { return NotFound(); }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            // 1- Send Confirmation Link To Angular
            var encodeToken = Encoding.UTF8.GetBytes(token);
            var newToken = WebEncoders.Base64UrlEncode(encodeToken);
            var ConfirmLinkUI = $"http://localhost:4200/passwordconfirm?ID={user.Id}&Token={newToken}";

            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("Trailer Site", "youssef.fcih@gmail.com"));
                message.To.Add(new MailboxAddress(user.UserName, user.Email));
                message.Subject = "My First Email";
                message.Body = new TextPart("plain")
                {
                    Text = "<a href=\"" + ConfirmLinkUI + "\">Reset Your Password</a>"
                };
                using (var client = new MailKit.Net.Smtp.SmtpClient())
                {
                    client.Connect("smtp.gmail.com", 587, false);
                    client.Authenticate("ymg1234567891011@gmail.com", "03@fcih@FCIH@");
                    client.Send(message);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest(ex.Message);
            }
            return new ObjectResult(new { token = newToken });
        }


        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByIdAsync(model.Id);
                if (user == null)
                    return NotFound();

                var newToken = WebEncoders.Base64UrlDecode(model.Token);
                var encodeToken = Encoding.UTF8.GetString(newToken);

                var result = await _userManager.ResetPasswordAsync(user, encodeToken, model.Password);
                if (result.Succeeded)
                {
                    return Ok();
                }
            }
            return BadRequest();
        }
        // [Authorize]
        // [HttpGet("getusers")]
        // public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        // {
        //         return await _db.Users.ToListAsync();
        // }

    }
}
