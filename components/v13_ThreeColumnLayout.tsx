"use client";
import React, { useContext, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRelay } from "../context/RelayContext";
import { useBitcoin } from "../v13_context/BitcoinContext";
import { useColorScheme } from "../v13_context/ColorSchemeContext";
const Header = dynamic(() => import("./v13_Header"), { ssr: false });
const SideBar = dynamic(() => import("./v13_SideBar"), { ssr: false });
const SidebarTuning = dynamic(() => import("./v13_SidebarTuning"), {
  ssr: false,
});
const SidebarTopics = dynamic(() => import("./v13_SidebarTopics"), {
  ssr: false,
});

const ThreeColumnLayout = (props: {
  children: React.ReactNode;
  RightSidebar?: React.ReactNode;
}) => {
  const { authenticated } = useBitcoin();
  const { colorScheme } = useColorScheme();
  console.log("colorScheme v13", colorScheme);

  const ToastTroubleShoot = () => {
    return (
      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-center p-4 ">
        <div className="bg-orange-500 text-white p-4 rounded-md">
          <p className="text-white">
            Have trouble login in?{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://askbitcoin.com/questions/08b40f405f9575e5b1d5489b7f5fe8353645f74816371214c3997aad3f4e1d6d"
            >
              <span className="ml-2 underline">Troubleshoot</span>
            </a>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`bg-primary-${colorScheme}-300 dark:bg-primary-${colorScheme}-700/20`}
    >
      {!authenticated && <ToastTroubleShoot />}
      <Header />
      <div className="h-16" />
      <div className="grid grid-cols-12">
        <div className="hidden lg:block col-span-3 lg:w-full lg:pr-7">
          <div className="w-20 xl:w-64 fixed top-16 h-[calc(100%-4rem)] z-50">
            <SideBar />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-9 xl:col-span-6 grid grid-cols-12">
          <div className="hidden lg:block col-span-1 xl:col-span-2" />
          <div className="col-span-12 lg:col-span-8">{props.children}</div>
          <div className="hidden lg:block col-span-2" />
        </div>
        <div className="hidden xl:block col-span-3 sticky top-[72px] w-full px-7">
          {props.RightSidebar ? (
            props.RightSidebar
          ) : (
            <>
              <div className="fixed top-[102px] z-50 w-[344px]">
                <SidebarTuning />
              </div>
              <div className="fixed top-[333px] z-50 w-[344px]">
                <SidebarTopics />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreeColumnLayout;
