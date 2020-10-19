
using System;
using System.ComponentModel.DataAnnotations;
namespace Trailer.API.Dtos
{
    public class EditCategoryDto
    {
        [Required]
        public int Id { get; set; }
        [Required, StringLength(150)]
        public string CategoryName { get; set; }

    }
}