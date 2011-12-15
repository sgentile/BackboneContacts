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
        //in memory for sample
        public static List<Contact> ContactsCollection = new List<Contact>
        {
            new Contact{id = Guid.NewGuid().ToString(), firstname = "Steve", lastname = "Gentile"}
        };

        [HttpGet]
        [ActionNameAttribute("read")]
        public ActionResult Read(string id)
        {
            var contact = ContactsCollection.FirstOrDefault(c => c.id == id);
            return Json(contact, JsonRequestBehavior.AllowGet);            
        }

        [HttpGet]
        [ActionNameAttribute("list")]
        public ActionResult List()
        {
            return Json(ContactsCollection, JsonRequestBehavior.AllowGet);
        }

        [HttpPut]
        [ActionNameAttribute("update")]
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
        [ActionNameAttribute("create")]
        public ActionResult Create(Contact model)
        {
            model.id = Guid.NewGuid().ToString();
            ContactsCollection.Add(model);
            return Json(model, JsonRequestBehavior.AllowGet);
        }

        [HttpDelete]
        [ActionNameAttribute("delete")]
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
