// @flow strict
import React from "react";
import { Link } from "gatsby";
import Author from "../Author";
import Comments from "./Comments";
import Content from "./Content";
import Meta from "./Meta";
import Tags from "./Tags";
import styles from "./Post.module.scss";

const Post = ({ post }) => {
  const { html } = post;
  const { tagSlugs, slug } = post.fields;
  const { tags, title, date } = post.frontmatter;

  return (
    <div className={styles["post"]}>
      <div className={styles["post__content"]}>
        <Content body={html} title={title} date={date} />
      </div>

      <div className={styles["post__footer"]}>
        {tags && tagSlugs && <Tags tags={tags} tagSlugs={tagSlugs} />}
        <div className={styles["post__authorContainer"]}>
          <Author showBio={true} />
        </div>
      </div>

      <div className={styles["post__comments"]}>
        <Comments postSlug={slug} postTitle={post.frontmatter.title} />
      </div>
    </div>
  );
};

export default Post;
