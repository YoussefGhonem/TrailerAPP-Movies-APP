using System;

namespace Trailer.API.Dtos
{
    public class UserForDetailsDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public int Age { get; set; }
        public string Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public string Bio { get; set; }
        public string Interests { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
       
        //public string PhotoURL { get; set; }
       // public ICollection<PhotoForDetailsDto> Photos { get; set; }
    }
}