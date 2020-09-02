using System;
using System.ComponentModel.DataAnnotations;
namespace Trailer.API.Dtos
{
    public class UserLoginDto
    {
     [StringLength(256),Required,EmailAddress]
      public string Email { get; set; }
     [Required]
      public bool RememberMe { get; set; }
      [Required]
      public  string Password { get; set; }

    }
}