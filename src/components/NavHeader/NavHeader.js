import classNames from "classnames/bind";
import React, { useState } from "react";
import Headroom from "react-headroom";

import Author from "../Author";
import styles from "./NavHeader.module.scss";

const cx = classNames.bind(styles);

function NavHeader() {
  const [menuShown, setMenuShown] = useState(false);

  return (
    <Headroom
      onUnpin={() => {
        setMenuShown(false);
      }}
    >
      <div className={cx({ header: true, "no-shadow": menuShown })}>
        <div className={styles["header__left"]}>
          <Author />
        </div>
      </div>
    </Headroom>
  );
}

export default NavHeader;
