﻿using Hippo.Core.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Hippo.Core.Data;
using Microsoft.EntityFrameworkCore;

namespace Hippo.Core.Services
{
    public interface IUserService
    {
        Task<User> GetUser(Claim[] userClaims);
        Task<User> GetCurrentUser();
    }

    public class UserService : IUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly AppDbContext _dbContext;
        public const string IamIdClaimType = "ucdPersonIAMID";

        public UserService(AppDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _dbContext = dbContext;
        }

        public async Task<User> GetCurrentUser()
        {
            if (_httpContextAccessor.HttpContext == null)
            {
                //TODO: Add when we have logging
                //Log.Warning("No HttpContext found. Unable to retrieve or create User.");
                return null;
            }

            var userClaims = _httpContextAccessor.HttpContext.User.Claims.ToArray();

            return await GetUser(userClaims);
        }

        // Get any user based on their claims, creating if necessary
        public async Task<User> GetUser(Claim[] userClaims)
        {
            string iamId = userClaims.Single(c => c.Type == IamIdClaimType).Value;

            var dbUser = await _dbContext.Users.SingleOrDefaultAsync(a => a.Iam == iamId);

            if (dbUser != null)
            {
                return dbUser; // already in the db, just return straight away
            }
            else
            {
                // not in the db yet, create new user and return
                var newUser = new User
                {
                    FirstName = userClaims.Single(c => c.Type == ClaimTypes.GivenName).Value,
                    LastName = userClaims.Single(c => c.Type == ClaimTypes.Surname).Value,
                    Email = userClaims.Single(c => c.Type == ClaimTypes.Email).Value,
                    Iam = iamId,
                    Kerberos = userClaims.Single(c => c.Type == ClaimTypes.NameIdentifier).Value
                };

                _dbContext.Users.Add(newUser);

                await _dbContext.SaveChangesAsync();

                return newUser;
            }
        }
    }
}