using System.Data;
using System.Text;
using System.Net.Mime;
using System;
using System.Web;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Trailer.API.Models;
using Trailer.API.Data;
using Trailer.API.Dtos;
using Trailer.API.Helpers;
using Microsoft.AspNetCore.Http;
using NETCore.MailKit.Core;
using MimeKit;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Collections.Generic;
using AngularToAPI.Models;

namespace Trailer.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    // [Authorize(Roles = "Admin")]
    public class CategoryController : ControllerBase
    {
        private readonly IAdminRepo _Repo;
        private readonly IMapper _mapper;


        public CategoryController(IAdminRepo Repo, IMapper mapper)
        {
            _Repo = Repo;
            _mapper = mapper;
        }

        [HttpGet("GetCategories")]
        public async Task<IEnumerable<Category>> GetCategories()
        {
            var category = await _Repo.GetCategories();
            if (category == null) return null;
            return category;

        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategory(int id)
        {
            var category = await _Repo.GetCategory(id);
            var categoryToReturn = _mapper.Map <CategoryForDetailsDto> (category);
            return Ok(categoryToReturn);
        }

        [HttpPost("DaleteAllCategory")]
        public async Task<ActionResult<Category>> DaleteAllCategory(List<string> ids)
        {

            if (ids.Count < 1)
            {
                return BadRequest("AcceptRejectRule");
            }
            var result = await _Repo.DaleteAllCategory(ids);
            if (result)
            {
                return Ok();
            }
            return BadRequest();
        }

        [HttpPost("AddCategory")]
        public async Task<ActionResult<Category>> AddCategory(AddCategoryDto model)
        {

            if (ModelState.IsValid)
            {
                var result = await _Repo.AddCategory(model);
                return Ok();
            }
            return BadRequest();
        }

        [HttpPut("EditCategory/{id}")]
        public async Task<IActionResult> EditCategory([FromRoute] int id, EditCategoryDto model)
        {
            var category = await _Repo.GetCategory(id);
            _mapper.Map(model, category);
            if (await _Repo.SaveAll())
                return NoContent();
            throw new Exception($"ff");


        }
    }
}