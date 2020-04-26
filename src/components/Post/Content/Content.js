// @flow strict
import React from "react";
import moment from "moment";

import styles from "./Content.module.scss";

type Props = {
  body: string,
  title: string,
  date: string,
};

const Content = ({ body, title, date }: Props) => (
  <div className={styles["content"]}>
    <h1 className={styles["content__title"]}>{title}</h1>
    <div className={styles["content__subtitle"]}>
      {moment(date).format("MMM D, YYYY")}
    </div>
    <div
      className={styles["content__body"]}
      dangerouslySetInnerHTML={{ __html: body }}
    />
  </div>
);

export default Content;
