using Hippo.Core.Data;
using Hippo.Core.Domain;
using Hippo.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Hippo.Web.Controllers;

[Authorize]
public class AccountController : SuperController
{
    private AppDbContext _dbContext;
    private IUserService _userService;

    public AccountController(AppDbContext dbContext, IUserService userService)
    {
        _dbContext = dbContext;
        _userService = userService;
    }

    // Return account info for the currently logged in user
    [HttpGet]
    public async Task<ActionResult> Get()
    {
        var currentUser = await _userService.GetCurrentUser();

        return Ok(await _dbContext.Accounts.AsNoTracking().SingleOrDefaultAsync(a => a.Owner.Iam == currentUser.Iam));
    }

    [HttpGet]
    public async Task<ActionResult> Sponsors()
    {
        return Ok(await _dbContext.Accounts.Where(a => a.CanSponsor).AsNoTracking().ToListAsync());
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CreateModel model)
    {
        var currentUser = await _userService.GetCurrentUser();

        // make sure current user doesn't already have another account
        if (await _dbContext.Accounts.AnyAsync(a => a.Owner.Iam == currentUser.Iam))
        {
            return BadRequest("You already have an account");
        }

        //TODO: Simple Ssh Validation

        var account = new Account()
        {
            CanSponsor = false, // TOOD: determine how new sponsors are created
            Owner = currentUser,
            SponsorId = model.SponsorId,
            SshKey = model.SshKey,
            IsActive = true,
            Name = currentUser.Name,
            Status = Account.Statuses.PendingApproval,
        };

        await _dbContext.Accounts.AddAsync(account);
        await _dbContext.SaveChangesAsync();

        return Ok(account);
    }

    public class CreateModel
    {
        public int SponsorId { get; set; }
        public string SshKey { get; set; } = string.Empty;
    }
}
