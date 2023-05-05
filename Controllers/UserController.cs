using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace biofood_test_jd.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class UserController : ControllerBase
    {
        readonly string filePath = Directory.GetCurrentDirectory() + "\\users.json"; 

        [HttpGet]
        //[Route("user/get")]
        public IEnumerable<User> Get()
        {
            if (!System.IO.File.Exists(filePath))
            {
                System.IO.File.Create(filePath);
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

        [HttpPost]
        //[Route("user/post")]
        public IActionResult Post(User user)
        {
            var jsonData = System.IO.File.ReadAllText(filePath);

            var users = JsonConvert.DeserializeObject<List<User>>(jsonData)
                      ?? new List<User>();

            user.id = users.Count();

            users.Add(user);

            jsonData = JsonConvert.SerializeObject(users);
            System.IO.File.WriteAllText(filePath, jsonData);

            return Ok();
        }

        [HttpDelete]
        public IActionResult Delete(int id)
        {
            var jsonData = System.IO.File.ReadAllText(filePath);

            var users = JsonConvert.DeserializeObject<List<User>>(jsonData)
                      ?? new List<User>();

            users.RemoveAt(id);

            jsonData = JsonConvert.SerializeObject(users);
            System.IO.File.WriteAllText(filePath, jsonData);

            return Ok();
        }
    }
}