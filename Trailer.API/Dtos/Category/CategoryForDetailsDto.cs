using System;
using System.ComponentModel.DataAnnotations;
namespace Trailer.API.Dtos
{
    public class CategoryForDetailsDto
    {

        [Required, StringLength(150)]
        public string CategoryName { get; set; }

    }
}