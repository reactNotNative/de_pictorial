import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { AiOutlineWallet } from "react-icons/ai";
import { ConnectButton, darkTheme } from "@rainbow-me/rainbowkit";
import { Suspense } from "react";
import Logo from "../public/logo.svg";
import { Button } from "@mantine/core";

const Header = () => {
  const [Account, setAccount] = useState(null);

  return (
    <div className="flex flex-col">
      <nav className="flex w-screen fixed top-0 p-5  z-10">
        <div className="flex container mx-auto bg-black bg-opacity-40 backdrop-blur-md rounded-3xl px-6 py-5 items-center justify-between">
          <Link href="/" className="w-full">
            <img src={Logo.src} alt="" />
          </Link>
          <div className="flex items-center justify-center gap-10 w-full">
            <Link
              href="/"
              className="text-base tracking-wide leading-relaxed text-white hover:opacity-60 transition ease-in-out duration-200"
            >
              Explore
            </Link>
            <Link
              href="/categories"
              className="text-base tracking-wide leading-relaxed text-white hover:opacity-60 transition ease-in-out duration-200"
            >
              Categories
            </Link>

            {Account && (
              <Link
                href="/dashboard"
                className="text-base tracking-wide leading-relaxed text-white hover:opacity-60 transition ease-in-out duration-200"
              >
                Dashboard
              </Link>
            )}
          </div>
          <div className="w-full flex justify-end">
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                // Note: If your app doesn't use authentication, you
                // can remove all 'authenticationStatus' checks
                const ready = mounted && authenticationStatus !== "loading";
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus ||
                    authenticationStatus === "authenticated");
                if (connected) {
                  setAccount(account.address);
                }
                if (!connected) {
                  setAccount(null);
                }
                return (
                  <div
                    {...(!ready && {
                      "aria-hidden": true,
                      style: {
                        opacity: 0,
                        pointerEvents: "none",
                        userSelect: "none",
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <Button
                            onClick={openConnectModal}
                            size="md"
                            leftIcon={<AiOutlineWallet size="20" />}
                            className="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500"
                            styles={{
                              root: { border: "none" },
                            }}
                          >
                            Connect Wallet
                          </Button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <Button
                            onClick={openChainModal}
                            size="md"
                            leftIcon={<AiOutlineWallet size="20" />}
                            className="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500"
                            styles={{
                              root: { border: "none" },
                            }}
                          >
                            Wrong network
                          </Button>
                        );
                      }

                      return (
                        <div style={{ display: "flex", gap: 12 }}>
                          <button
                            onClick={openChainModal}
                            style={{ display: "flex", alignItems: "center" }}
                            type="button"
                          >
                            {chain.hasIcon && (
                              <div
                                style={{
                                  background: chain.iconBackground,
                                  width: 12,
                                  height: 12,
                                  borderRadius: 999,
                                  overflow: "hidden",
                                  marginRight: 4,
                                }}
                              >
                                {chain.iconUrl && (
                                  <img
                                    alt={chain.name ?? "Chain icon"}
                                    src={chain.iconUrl}
                                    style={{ width: 12, height: 12 }}
                                  />
                                )}
                              </div>
                            )}
                            {chain.name}
                          </button>
                          <Button
                            onClick={openAccountModal}
                            size="md"
                            leftIcon={<AiOutlineWallet size="20" />}
                            className="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500"
                            styles={{
                              root: { border: "none" },
                            }}
                          >
                            {account.displayName}
                          </Button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
