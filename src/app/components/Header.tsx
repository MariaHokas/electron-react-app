import React from "react";
import Logo from "../images/images.jpg";

export default function Header(props: {
  headerText:
    | boolean
    | React.ReactChild
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined;
}) {
  return (
    <header>
      <h1>{props.headerText}</h1>
      <div className="header_container">
        <div className="paragraph-column"></div>
        <div className="img-logo-column">
          <img width="50" src={Logo} alt="Logo" />
        </div>
      </div>
    </header>
  );
}
