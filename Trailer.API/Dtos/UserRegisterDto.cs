using System;
using System.ComponentModel.DataAnnotations;
namespace Trailer.API.Dtos
{
    public class UserRegisterDto
    {
     [StringLength(256),Required,EmailAddress]
      public string Email { get; set; }
     [StringLength(256),Required]
      public string UserName { get; set; }
      [Required]
      public  string Password { get; set; }
    //   public  string UserName { get; set; }
    //   public string Gender { get; set; }
    //   public DateTime DateOfBirth { get; set; }
    //  public string City { get; set; }
    //  public string Country { get; set; }

    }
}