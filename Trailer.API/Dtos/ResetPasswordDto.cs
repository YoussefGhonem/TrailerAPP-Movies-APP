using System;
using System.ComponentModel.DataAnnotations;
namespace Trailer.API.Dtos
{
    public class ResetPasswordDto
    {
        [Required]
        public string Token { get; set; }

        [Required]
        public string Password { get; set; }
        [Required]
        public string Id { get; set; }

    }
}