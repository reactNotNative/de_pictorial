import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
// import openseaLogo from '../assets/opensea.png'
import { AiOutlineSearch } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import { AiOutlineWallet } from 'react-icons/ai';
import { MdOutlineAccountBalanceWallet } from 'react-icons/md';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Logo from '../public/logo.svg';
import { Button } from '@nextui-org/react';
const style = {
  wrapper: `bg-[#04111d] w-screen px-[1.2rem] py-[0.8rem] flex `,
  logoContainer: `flex items-center cursor-pointer`,
  logoText: ` ml-[0.8rem] text-white font-semibold text-2xl`,
  searchBar: `flex flex-1 mx-[0.8rem] w-max-[520px] items-center bg-[#363840] rounded-[0.8rem] hover:bg-[#4c505c]`,
  searchIcon: `text-[#8a939b] mx-3 font-bold text-lg`,
  searchInput: `h-[2.6rem] w-full border-0 bg-transparent outline-0 ring-0 px-2 pl-0 text-[#e6e8eb] placeholder:text-[#8a939b]`,
  headerItems: ` flex items-center justify-end`,
  headerItem: `text-white px-4 font-bold text-[#c8cacd] hover:text-white cursor-pointer`,
  headerIcon: `text-[#8a939b] text-3xl font-black px-4 hover:text-white cursor-pointer`,
};

const Header = () => {
  const SocialLoginDynamic = dynamic(
    () => import('../components/scw.jsx').then((res) => res.default),
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
      <nav className="flex w-screen fixed p-10 z-10">
        <div className="flex container mx-auto bg-black bg-opacity-40 backdrop-blur-md rounded-3xl px-10 py-3.5 items-center justify-between">
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
              color="gradient"
              auto
              icon={<AiOutlineWallet size="20" />}
              css={{
                background:
                  'conic-gradient(at right bottom, rgb(136, 19, 55), rgb(225, 29, 72), rgb(217, 70, 239))',
              }}
            >
              <p className="text-base tracking-wide leading-relaxed text-white">
                Connect Wallet
              </p>
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
