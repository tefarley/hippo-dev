﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace Hippo.Core.Domain
{
    public class User
    {
        public User()
        {
            IsAdmin = false;
        }

        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        [Display(Name = "First Name")]
        public string FirstName { get; set; }

        [Required]
        [StringLength(50)]
        [Display(Name = "Last Name")]
        public string LastName { get; set; }

        [Required]
        [StringLength(300)]
        [EmailAddress]
        public string Email { get; set; }

        [StringLength(10)]
        public string Iam { get; set; }

        [StringLength(20)]
        public string Kerberos { get; set; }

        [StringLength(20)] //It probably isn't this long....
        public string MothraId { get;set;}

        [JsonIgnore]
        public List<Account> Accounts { get; set; }

        [Display(Name = "Name")]
        public string Name => FirstName + " " + LastName;

        public bool IsAdmin { get; set; } //Potentially use this for a super admin?

        internal static void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasIndex(a => a.Iam).IsUnique();
            modelBuilder.Entity<User>().HasIndex(a => a.Email); 
            modelBuilder.Entity<User>().HasIndex(a => a.IsAdmin);

            modelBuilder.Entity<Account>()
                .HasOne(a => a.Owner)
                .WithMany(a => a.Accounts)
                .HasForeignKey(a => a.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
