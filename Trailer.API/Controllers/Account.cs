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
using System.Net.Mail;
using MailKit.Security;
using MimeKit;

namespace Trailer.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IAccountRepository _Repo;
        private readonly UserManager<User> _userManager;

        private readonly IMapper _mapper;
        private readonly IEmailService _iEmailService;
        private readonly SignInManager<User> _signInManager;

        public AccountController(IAccountRepository Repo, UserManager<User> userManager, IMapper mapper,
        IEmailService iEmailService,SignInManager<User> signInManager)
        {
            _Repo = Repo;
            _mapper = mapper;
            _iEmailService = iEmailService;
            _signInManager = signInManager;
            _userManager = userManager;

        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDto userRegisterDto)
        {
            if (userRegisterDto == null)
            {
                return NotFound();
                //
            }
            if (ModelState.IsValid)
            {
                if (_Repo.UserEmailExists(userRegisterDto.Email))
                {
                    return BadRequest("email is Taken Before");
                }
                if (_Repo.UserNameExists(userRegisterDto.UserName))
                {
                    return BadRequest("UserName is Taken Before");
                }

                var userToCreate = _mapper.Map<User>(userRegisterDto);
                //    var userToCreate = new User{
                //        Email=userRegisterDto.Email,
                //        PasswordHash=userRegisterDto.Password,
                //        UserName=userRegisterDto.UserName
                //    };
                var result = await _userManager.CreateAsync(userToCreate, userRegisterDto.Password);
                // var userToReturn = _mapper.Map<UserForDetailsDto>(userToCreate);
                if (result.Succeeded)
                {
                    // 1-Generate Token
                    var token = await _userManager.GenerateEmailConfirmationTokenAsync(userToCreate);
                    var ConfirmLink = Url.Action("RegistrationConfirm", "Account", new
                    {
                        ID = userToCreate.Id,
                        Token = HttpUtility.UrlEncode(token)
                    }, Request.Scheme, Request.Host.ToString());

                    // await _iEmailService.SendAsync("youssef.fcih@gmil.com", "Email Confirm", $"<a href=\" {ConfirmLink}  \"> Registration Confirm Link  </a>",true);
                    try
                    {
                        var message = new MimeMessage();
                        message.From.Add(new MailboxAddress("Trailer Site", "youssef.fcih@gmail.com"));
                        message.To.Add(new MailboxAddress(userToCreate.UserName, userToCreate.Email));
                        message.Subject = "My First Email";
                        message.Body = new TextPart("plain")
                        {
                            Text =  ConfirmLink 
                        };

                        using ( var client = new MailKit.Net.Smtp.SmtpClient())
                        {

                            client.Connect("smtp.gmail.com", 587, false);

                            //SMTP server authentication if needed
                          client.Authenticate("ymg1234567891011@gmail.com", "03@fcih@FCIH@");

                         client.Send(message);
                            //client.Disconnect(true);
                        }

                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.Message);
                        return BadRequest(ex.Message);
                    }
                    return Ok(StatusCodes.Status200OK);
                  //  return Ok("Registration Complited");

                    // var TextContent = "Regiser Confirmation in ourite";
                    // var link = "<a href=\"" + ConfirmLink + "\"> Registration Confirm Link  </a>";
                    // var subject = "Registration Confirm";

                    // if (await SendGridAPI.Execute(userToCreate.Email, userToCreate.UserName, TextContent, link, subject))
                    // {
                    //     return Ok("Registration Complited");
                    // }

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
            var result = await _userManager.ConfirmEmailAsync(user, HttpUtility.UrlDecode(Token));
            if (result.Succeeded)
                return Ok();
            else
                return BadRequest(result.Errors);
        }
         [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto userLoginDto)
        {
            if (userLoginDto==null)
                return NotFound();
            var user = await _userManager.FindByEmailAsync(userLoginDto.Email);
            if (user == null)
                return NotFound();
            if (!user.EmailConfirmed) // if user not confirm his email
                return Unauthorized("Email not confirm yet");

            var result = await _signInManager.PasswordSignInAsync(user, userLoginDto.Password,userLoginDto.RememberMe,false);
            if (result.Succeeded)
                return Ok("login Success");
            else
                return BadRequest(result.IsNotAllowed);
        }
    }
       
    }
