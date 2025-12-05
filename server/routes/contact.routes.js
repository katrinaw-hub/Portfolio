// Contact routes:
// - Public POST to create a contact
// - Admin-only READ/UPDATE/DELETE

import express from "express";
import contactCtrl from "../controllers/contact.controller.js";
import authCtrl from "../controllers/auth.controller.js";

const router = express.Router();

router
  .route("/api/contacts")
  .get(authCtrl.requireSignin, authCtrl.requireAdmin, contactCtrl.list)
  .post(contactCtrl.create)
  .delete(authCtrl.requireSignin, authCtrl.requireAdmin, contactCtrl.removeAll);

router
  .route("/api/contacts/:contactId")
  .get(authCtrl.requireSignin, authCtrl.requireAdmin, contactCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.requireAdmin, contactCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.requireAdmin, contactCtrl.remove);

router.param("contactId", contactCtrl.contactByID);

export default router;
