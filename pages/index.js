import { ConnectButton } from "@rainbow-me/rainbowkit";
import Head from "next/head";
import React, {useEffect} from "react";
import { useRouter } from "next/router";
import {Router} from "react-router-dom"
import Navbar from "../components/Navbar";


const LandingPage = () => {

  const router = useRouter();

  return (
    <div>
      <Head></Head>
      <main className="h-screen max-w-full flex flex-col justify-around items-center bg-blue-200">
        <div className="w-50 h-50 text-center text-gray-900 font-bold text-8xl py-10">
          Read My Diary
        </div>
        <button
          className="w-48 h-16 bg-blue-500 rounded-lg border-none text-white font-bold text-2xl"
          onClick={() => {
            router.push("/Home");
          }}
        >
          Enter Dapp
        </button>
      </main>
    </div>
  );
};

export default LandingPage;
