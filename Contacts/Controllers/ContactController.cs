using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Contacts.Models;

namespace Contacts.Controllers
{
    //        create → POST   /collection
    //read → GET   /collection[/id]
    //update → PUT   /collection/id
    //delete → DELETE   /collection/id
    public class ContactController : Controller
    {
        public static List<Contact> ContactsCollection = new List<Contact>
        {
            new Contact{id = Guid.NewGuid().ToString(), firstname = "Steve", lastname = "Gentile"}
        };

        [HttpGet]
        [ActionNameAttribute("Contacts")]
        public ActionResult Get(string id)
        {
            if(!string.IsNullOrEmpty(id))
            {
                var contact = ContactsCollection.FirstOrDefault(c => c.id == id);
                return Json(contact, JsonRequestBehavior.AllowGet);
            }
            return Json(ContactsCollection, JsonRequestBehavior.AllowGet);
        }

        [HttpPut]
        [ActionNameAttribute("Contacts")]
        public ActionResult Update(Contact model)
        {
            var contact = ContactsCollection.FirstOrDefault(c => c.id == model.id);
            if (contact != null)
            {
                contact.firstname = model.firstname;
                contact.lastname = model.lastname;
            }

            return Json(contact, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [ActionNameAttribute("Contacts")]
        public ActionResult Create(Contact model)
        {
            model.id = Guid.NewGuid().ToString();
            ContactsCollection.Add(model);
            return Json(model, JsonRequestBehavior.AllowGet);
        }

        [HttpDelete]
        [ActionNameAttribute("Contacts")]
        public ActionResult Delete(string id)
        {
            var contact = ContactsCollection.FirstOrDefault(c => c.id == id);
            if (contact != null)
            {
                ContactsCollection.Remove(contact);
            }
            return Json(new { id });            
        }
    }
}
