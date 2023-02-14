import Image from "next/image";
import Link from "next/link";
import React from "react";
// import openseaLogo from '../assets/opensea.png'
import { AiOutlineSearch } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { AiOutlineWallet } from "react-icons/ai";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Logo from "../public/logo.svg";
import { Button } from "@mantine/core";

const Header = () => {
  const SocialLoginDynamic = dynamic(
    () => import("../components/scw.jsx").then((res) => res.default),
    {
      ssr: false,
    }
  );

  return (
    <div className="flex flex-col">
      {/* <div className={style.wrapper}>
        <Link href="/">
          <div className={style.logoContainer}>
            <div className={style.logoText}>Opensea</div>
          </div>
        </Link>
        <div className={style.searchBar}>
          <div className={style.searchIcon}>
            <AiOutlineSearch />
          </div>
          <input
            className={style.searchInput}
            placeholder="Search items, collections, and accounts"
          />
        </div>
        <div className={style.headerItems}>
          <Link href="/collections/0x66a576A977b7Bccf510630E0aA5e450EC11361Fa">
            <div className={style.headerItem}> Collections </div>
          </Link>
          <div className={style.headerItem}> Stats </div>
          <div className={style.headerItem}> Resources </div>
          <div className={style.headerItem}> Create </div>
          <div className={style.headerIcon}>
            <CgProfile />
          </div>
          <div className={style.headerIcon}>
            <ConnectButton />
            <Suspense fallback={<div>Loading...</div>}>
              <SocialLoginDynamic />
            </Suspense>
          </div>
        </div>
      </div> */}
      <nav className="flex w-screen fixed top-0 p-5  z-10">
        <div className="flex container mx-auto bg-black bg-opacity-40 backdrop-blur-md rounded-3xl px-6 py-5 items-center justify-between">
          <div className="w-full">
            <img src={Logo.src} alt="" />
          </div>
          <div className="flex items-center justify-center gap-10 w-full">
            <Link
              href="/"
              className="text-base tracking-wide leading-relaxed text-white hover:opacity-60 transition ease-in-out duration-200"
            >
              Explore
            </Link>
            <Link
              href="/"
              className="text-base tracking-wide leading-relaxed text-white hover:opacity-60 transition ease-in-out duration-200"
            >
              Categories
            </Link>
            <Link
              href="/"
              className="text-base tracking-wide leading-relaxed text-white hover:opacity-60 transition ease-in-out duration-200"
            >
              Dashboard
            </Link>
          </div>
          <div className="w-full flex justify-end">
            <Button
              size="md"
              leftIcon={<AiOutlineWallet size="20" />}
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan" }}
            >
              Connect Wallet
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
