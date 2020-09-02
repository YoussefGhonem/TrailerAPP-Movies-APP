using System.Runtime.InteropServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Trailer.API.Data;
using Trailer.API.Models;
using Microsoft.AspNetCore.Identity;
using NETCore.MailKit.Extensions;
using NETCore.MailKit.Infrastructure.Internal;

namespace Trailer.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

         
            services.AddControllers();
            // DB Connect
            services.AddDbContext<DataContext>(x => x.UseSqlServer(Configuration.GetConnectionString("MyConnection")));
            // ASP Identity
            services.AddIdentity<User, Role>(Option =>
            { // validation on Password
                Option.Password.RequireDigit = false;
                Option.Password.RequiredLength = 4;
                Option.Password.RequireLowercase = false;
                Option.Password.RequireUppercase = false;
                Option.Password.RequiredUniqueChars = 0;
                Option.Password.RequireNonAlphanumeric = false;
                Option.SignIn.RequireConfirmedEmail = true; // 1-Send Email

            }
            ).AddEntityFrameworkStores<DataContext>().AddDefaultTokenProviders();// 2-Generate Token

            // Repository
            services.AddScoped<IAccountRepository, AccountRepository>();
            services.AddAutoMapper(); //AddAutoMapper 

            services.AddMailKit(x => x.UseMailKit(Configuration.GetSection("Email").Get<MailKitOptions>()));
             // CORS Policy
             services.AddCors();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
           // app.UseHttpsRedirection();

            app.UseRouting();
            //app.UseCors(x => x.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod()); //CORS Policy
            //app.UseCors("CorsPolicy");
          //  app.UseCors(x => x.WithOrigins("http://localhost:4200").AllowAnyMethod().AllowAnyHeader());
          app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            app.UseAuthorization();
            app.UseAuthentication(); // ASP Identity

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
          

        }
        
    }
}
