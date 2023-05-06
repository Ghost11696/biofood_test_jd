using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace biofood_test_jd.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class UserController : ControllerBase
    {
        readonly string filePath = Directory.GetCurrentDirectory() + "\\users.json";
        readonly string accessToken = "biofood_test_jd-TOKEN";

        [HttpGet]
        public ActionResult<IEnumerable<User>> Get()
        {
            string token = HttpContext.Request?.Headers["ADD-KEY"];
            if (token != accessToken)
            {
                return Unauthorized();
            }

            var jsonData = System.IO.File.ReadAllText(filePath);
            var users = JsonConvert.DeserializeObject<List<User>>(jsonData)
                ?? new List<User>();

            if (Request.QueryString.HasValue)
            {
                var searchterm = Request.Query["searchterm"];
                users = users.Where(u => u.firstname.Contains(searchterm)
                                       || u.lastname.Contains(searchterm)
                                    ).ToList();
            }

            return users;
           
        }

        [HttpDelete]
        public IActionResult Delete(int id)
        {
            string token = HttpContext.Request?.Headers["ADD-KEY"];
            if(token != accessToken)
            {
                return Unauthorized();
            }

            var jsonData = System.IO.File.ReadAllText(filePath);

            var users = JsonConvert.DeserializeObject<List<User>>(jsonData)
                      ?? new List<User>();

            users.RemoveAt(id);

            jsonData = JsonConvert.SerializeObject(users);
            System.IO.File.WriteAllText(filePath, jsonData);

            return Ok();
        }


        [HttpPost]
        public IActionResult SignUp(User user)
        {
            var jsonData = System.IO.File.ReadAllText(filePath);

            var users = new List<User>();
            if (!string.IsNullOrWhiteSpace(jsonData))
            {
                users = JsonConvert.DeserializeObject<List<User>>(jsonData);                               

                var newUser = users.FirstOrDefault(u => u?.firstname == user?.firstname
                                        && u?.lastname == user?.lastname);

                if (newUser != null) { return BadRequest("Existing User"); }

                user.id = users.Last().id + 1;
            }

            users.Add(user);

            jsonData = JsonConvert.SerializeObject(users);
            System.IO.File.WriteAllText(filePath, jsonData);

            return Ok();
        }


        [HttpPost]
        public IActionResult SignIn(User user)
        {
            var jsonData = System.IO.File.ReadAllText(filePath);

            var users = JsonConvert.DeserializeObject<List<User>>(jsonData)
                      ?? new List<User>();

            var authUser = users.FirstOrDefault(u => u?.firstname == user?.firstname
                                    && u?.lastname == user?.lastname)?.id;

            if (authUser == null) { return NotFound("User not found"); }

            return Ok(new { authUser, accessToken });
        }

    }
}