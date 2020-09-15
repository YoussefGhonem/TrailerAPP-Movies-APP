using AngularToAPI.ModelViews.users;
using AutoMapper;
using Trailer.API.Dtos;
using Trailer.API.Models;

namespace Trailer.API.Helpers
{
    public class AutoMapperProfiles :Profile
    {
        public AutoMapperProfiles ()
        {
            CreateMap<UserRegisterDto,User>();
            CreateMap<AddUserModel,User>();
            CreateMap<EditUserModel,User>();
        }
    }
}