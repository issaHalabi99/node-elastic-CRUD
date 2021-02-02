import { Router } from "express";
import { body } from "express-validator";
import * as postController from "../controllers/post.js";

const router = Router();

router.post(
  "/add-post",
  [
    body("title")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please don't send a empty data."),
    body("desc")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please don't send a empty data."),
    body("content")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please don't send a empty data."),
  ],
  postController.addPost
);

router.get("/get-all-post", postController.getPosts);

router.put(
  "/update-post/:postId",
  [
    body("title")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please don't send a empty data."),
    body("desc")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please don't send a empty data."),
    body("content")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please don't send a empty data."),
  ],
  postController.updatePost
);

router.delete("/delete-post/:postId", postController.deletePost);

export default router;
