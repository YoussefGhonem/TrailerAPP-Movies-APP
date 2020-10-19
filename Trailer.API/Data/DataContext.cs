using System;
using AngularToAPI.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Trailer.API.Models;

namespace Trailer.API.Data
{
    public class DataContext:IdentityDbContext<User,Role,String>
    {
        public DataContext(DbContextOptions<DataContext>options):base(options) {}
        public DbSet<Category> Categories { get; set; }
        public DbSet<SubCategory> SubCategories { get; set; }
        public DbSet<Movie> Movies { get; set; }
        public DbSet<MovieActor> MovieActors { get; set; }
        public DbSet<MovieLink> MovieLinks { get; set; }

    }
}