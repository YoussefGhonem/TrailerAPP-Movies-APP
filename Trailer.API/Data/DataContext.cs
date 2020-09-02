using System;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Trailer.API.Models;

namespace Trailer.API.Data
{
    public class DataContext:IdentityDbContext<User,Role,String>
    {
        public DataContext(DbContextOptions<DataContext>options):base(options) {}
    }
}