// Data/AppDbContext.cs
using Microsoft.EntityFrameworkCore;
using ContactsAPI.Models;
using System.Collections.Generic;

namespace ContactsAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Contact> Contacts { get; set; }

        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    modelBuilder.Entity<Contact>().HasData(
        //    new Contact { Id = 1, Name = "Prajakta Doe", Email = "prajakta@example.com", Phone = "9874567890" },
        //    new Contact { Id = 2, Name = "Raj Smith", Email = "raj@example.com", Phone = "9876543210" }
        //    );
        //}
    }
}

