import { validationResult } from "express-validator";

import { Client } from "@elastic/elasticsearch";
const client = new Client({ node: "http://localhost:9200" });

export async function addPost(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    client.index(
      {
        index: "posts",
        type: "news",
        body: req.body,
      },
      function (err, resp, status) {
        if (err) {
          console.log(err);
        } else {
          return res.status(200).send({
            message: "POST Created !",
          });
        }
      }
    );
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

export async function updatePost(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const { postId } = req.params;

    const post = await client.get({
      index: "posts",
      type: "news",
      id: postId,
    });
    if (!post) {
      const error = new Error("Could not find post.");
      error.statusCode = 404;
      throw error;
    }
    const result = await client.update({
      index: "posts",
      type: "news",
      id: postId,
      body: {
        doc: {
          ...req.body,
        },
      },
    });

    if (!result) {
      const error = new Error("Could not update post.");
      error.statusCode = 404;
      throw error;
    }
    return res.status(201).json({
      message: "Post updated!",
      id: result.body._id,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

export async function deletePost(req, res, next) {
  try {
    const { postId } = req.params;
    const result = await client.delete({
      index: "posts",
      type: "news",
      id: postId,
    });
    return res.status(201).json({
      message: "Post deleted!",
      id: result.body._id,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

export async function getPosts(req, res, next) {
  try {
    const result = await client.search({
      index: "posts",
      type: "news",
    });

    if (!result) {
      const error = new Error("Could not find post.");
      error.statusCode = 404;
      throw error;
    }
    if (!result.body.hits.hits) {
      return res.status(201).json({
        message: "No Posts Found !",
      });
    }
    return res.status(201).json({
      message: "GET Posts!",
      result: result.body.hits.hits,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
