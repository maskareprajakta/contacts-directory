using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ContactsAPI.Data;
using ContactsAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ContactsAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContactController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/contact
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Contact>>> GetContacts()
        {
            var contacts = await _context.Contacts.ToListAsync();

            if (contacts == null || contacts.Count == 0)
            {
                // Return 404 Not Found if no contacts found
                return NotFound();
            }

            // Return 200 OK with the contacts
            return Ok(contacts);
        }

        // GET api/contact/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Contact>> GetContact(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);

            if (contact == null)
            {
                // Return 404 Not Found if contact not found
                return NotFound();
            }

            return contact;
        }

        // POST api/contact/PostContact
        [HttpPost("PostContact")]
        public async Task<ActionResult<Contact>> PostContact([FromBody] Contact contact)
        {
            // Check if a contact with the same email or phone already exists
            var existingContact = await _context.Contacts.FirstOrDefaultAsync(c => c.email == contact.email || c.phone == contact.phone);
            if (existingContact != null)
            {
                // Return conflict response if duplicate contact found
                return Conflict("A contact with the same email or phone already exists.");
            }

            // Add the new contact
            _context.Contacts.Add(contact);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetContact), new { id = contact.id }, contact);
        }

        // PUT api/contact/PutContact/5
        [HttpPut("PutContact/{id}")]
        public async Task<IActionResult> PutContact(int id, [FromBody] Contact contact)
        {
            if (id != contact.id)
            {
                // Return bad request if ID in the URL doesn't match ID in the request body
                return BadRequest();
            }

            _context.Entry(contact).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContactExists(id))
                {
                    // Return 404 Not Found if contact doesn't exist
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE api/contact/DeleteContact/5
        [HttpDelete("DeleteContact/{id}")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null)
            {
                // Return 404 Not Found if contact doesn't exist
                return NotFound();
            }

            _context.Contacts.Remove(contact);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Check if a contact with the given ID exists
        private bool ContactExists(int id)
        {
            return _context.Contacts.Any(e => e.id == id);
        }
    }
}
