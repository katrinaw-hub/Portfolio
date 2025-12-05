// Public read of credentials, admin-only CRUD.

import express from "express";
import credentialCtrl from "../controllers/credential.controller.js";
import authCtrl from "../controllers/auth.controller.js";

const router = express.Router();

router
  .route("/api/qualifications")
  .get(credentialCtrl.list)
  .post(authCtrl.requireSignin, authCtrl.requireAdmin, credentialCtrl.create)
  .delete(authCtrl.requireSignin, authCtrl.requireAdmin, credentialCtrl.removeAll);

router
  .route("/api/qualifications/:credentialId")
  .get(credentialCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.requireAdmin, credentialCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.requireAdmin, credentialCtrl.remove);

router.param("credentialId", credentialCtrl.credentialByID);

export default router;