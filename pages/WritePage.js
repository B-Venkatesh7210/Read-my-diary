import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useDiaryStore } from "../state/store";
import { useAccount, useSigner, useContract, useProvider } from "wagmi";
import contractConfig from "../contractConfig.json";
import { useRouter } from "next/router";
import * as EpnsAPI from "@epnsproject/sdk-restapi";
import * as ethers from "ethers";
import { parseEther } from "ethers/lib/utils";

const WritePage = () => {
  const allDiaries = useDiaryStore((state) => state.allDiaries);
  const writingFee = useDiaryStore((state) => state.writingFee);
  const [diaryId, setDiaryId] = useState();
  const [totalPages, setTotalPages] = useState();
  const { isConnected, address } = useAccount();
  const [pageText, setPageText] = useState("");

  const { data: signer } = useSigner();
  const provider = useProvider();
  const router = useRouter();

  const PK = "your_channel_address_secret_key"; // channel private key
  const Pkey = `0x${PK}`;
  const signer2 = new ethers.Wallet(Pkey);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const diaryId = searchParams.get("diaryId");
    setDiaryId(diaryId);
    console.log(diaryId);
  }, []);

  const writingPage = async () => {
    if (!isConnected) {
      alert("Connect your Wallet");
    } else {
      try {
        const contract = new ethers.Contract(
          contractConfig.address,
          contractConfig.abi,
          signer
        );
        const txn = await contract.writingPage(diaryId, pageText, {
          from: signer._address,
          value: ethers.utils.parseEther(writingFee.toString()),
        });
        await txn.wait();
        router.push("/Home");
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (isConnected && diaryId && signer) {
      const totalPages =
        parseInt(allDiaries[diaryId]?.totalPages.toString()) + 1;
      console.log(totalPages);
      const totalPages2 = totalPages.toString();
      console.log(totalPages2);
      setTotalPages(totalPages2);
      console.log(signer._address);
    }
  }, [isConnected, diaryId, allDiaries, signer]);

  return (
    <div className="background max-h-screen h-screen w-full flex flex-col justify-start items-center noScrollbar overflow-auto">
      <Navbar />
      <div className="w-full flex flex-row justify-center items-center">
        <div
          className="singlePage w-2/6 mb-5 flex flex-col justify-start items-center py-3 px-5"
          style={{ borderRadius: "0px 50px 50px 0px", height: "36rem" }}
        >
          <div className="flex flex-row w-full justify-start items-start">
            <span className="title2" style={{ fontSize: "36px" }}>
              {totalPages}
            </span>
          </div>
          <div className="w-full h-4/5 bg-pink-300 rounded-3xl mt-2 border-2 flex flex-col justify-start items-start border-slate-600 py-3 px-5">
            {/* <span className="title" style={{ fontSize: "22px" }}> */}
            <textarea
              type="text"
              placeholder="(max 3000 char)"
              className="inputText title text-xl noScrollbar"
              style={{ width: "26rem", height: "25rem", overflowY: "scroll" }}
              onChange={(e) => {
                setPageText(e.target.value);
              }}
            ></textarea>
            {/* </span> */}
          </div>
          <div className="flex flex-row w-full justify-start items-baseline mt-3">
            <span className="title" style={{ fontSize: "24px" }}>
              Writing Fee
            </span>
            <span className="title2 ml-5" style={{ fontSize: "36px" }}>
              {writingFee}
            </span>
          </div>
        </div>
        <button
          className="button w-48 flex flex-row justify-center items-center mt-4 ml-20"
          style={{
            fontSize: "24px",
            height: "60px",
            borderRadius: "20px",
          }}
          onClick={() => {
            writingPage();
          }}
        >
          <span className="title text-2xl">Write Page</span>
        </button>
      </div>
    </div>
  );
};

export default WritePage;