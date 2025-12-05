// User routes:
// - Public POST /api/users for signup
// - Admin GET/DELETE all users
// - Per-user GET/PUT/DELETE with authorization checks.

import express from "express";
import userCtrl from "../controllers/user.controller.js";
import authCtrl from "../controllers/auth.controller.js";

const router = express.Router();

router
  .route("/api/users")
  .get(authCtrl.requireSignin, authCtrl.requireAdmin, userCtrl.list)
  .post(userCtrl.create)
  .delete(authCtrl.requireSignin, authCtrl.requireAdmin, userCtrl.removeAll);

router
  .route("/api/users/:userId")
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove);

router.param("userId", userCtrl.userByID);

export default router;