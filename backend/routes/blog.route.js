import express from "express";
import {
  createBlog,
//   deleteBlog,
//   getAllBlogs,
//   getMyBlogs,
//   getSingleBlogs,
//   updateBlog,
} from "../controller/blog.controller.js";
import {isAdmin,isAuthenticated } from "../middleware/authUser.js";
import { deleteBlog } from "../controller/blog.controller.js";
import { getAllBlogs } from "../controller/blog.controller.js";
import { getSingleBlogs } from "../controller/blog.controller.js";
import { getMyBlogs } from "../controller/blog.controller.js";
import { updateBlog } from "../controller/blog.controller.js";

const router = express.Router();

//router.post("/create",createBlog);
router.post("/create", isAuthenticated,isAdmin("admin"),createBlog);
router.delete("/delete/:id", isAuthenticated, isAdmin("admin"), deleteBlog);
 router.get("/all-blogs", isAuthenticated,getAllBlogs);
 router.get("/single-blog/:id", isAuthenticated, getSingleBlogs);
 router.get("/my-blog", isAuthenticated, isAdmin("admin"), getMyBlogs);
 router.put("/update/:id", isAuthenticated, isAdmin("admin"), updateBlog);

export default router;
