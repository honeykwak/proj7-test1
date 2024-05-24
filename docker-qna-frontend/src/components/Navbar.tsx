import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from "@nextui-org/react";
import NicknameButton from "./NicknameButton";

import React from "react";

const Navigation = () => {
  return (
    <>
      <Navbar position="static">
        <NavbarBrand>
          <Link href="/">
            <p className="font-bold text-inherit">1조의 서글픈 Q&A</p>
          </Link>
        </NavbarBrand>

        <NavbarContent justify="end">
          <NavbarItem>
            <NicknameButton />
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </>
  );
};

export default Navigation;
