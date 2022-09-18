import Navbar from "../components/Navbar";
import React, { useState, useEffect } from "react";
import { useAccount, useSigner, useContract } from "wagmi";
import contractConfig from "../contractConfig.json";
import { ethers } from "ethers";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import NftPage from "./NftPage";
import { useRouter } from "next/router";
import { useDiaryStore } from "../state/store";

const Home = () => {
  const { isConnected, address } = useAccount();
  const { data: signer, isError, isLoading } = useSigner();
  const contract = useContract({
    addressOrName: contractConfig.address,
    contractInterface: contractConfig.abi,
    signerOrProvider: signer,
  });

  const [formData, setFormData] = useState({
    diaryName: "",
    fee: "",
  });
  const allDiaries = useDiaryStore((state) => state.allDiaries);
  const setAllDiaries = useDiaryStore((state) => state.setAllDiaries);
  const router = useRouter();

  const publishDiary = async () => {
    if (!isConnected) {
      alert("Connect your Wallet");
    } else {
      try {
        console.log(ethers.utils.parseUnits(formData.fee, 18).toString());
        const txn = await contract.publishDiary(
          formData.diaryName,
          ethers.utils.parseUnits(formData.fee, 18)
        );
        await txn.wait();
        setFormData({
          diaryName: "",
          fee: "",
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const getAllDiaries = async () => {
      const allDiaries = await contract.getAllDiaries();
      console.log({allDiaries});
      setAllDiaries(allDiaries);
    };
    if (contract.provider) {
      getAllDiaries();
    }
  }, [contract]);

  return (
    <div className="h-screen w-full flex flex-col justify-start items-center bg-blue-200 overflow-auto">
      <Navbar></Navbar>
      <div className="h-full w-1/2 flex flex-col justify-evenly items-center">
        <span className="text-black font-bold text-4xl">
          Publish your diary
        </span>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            publishDiary();
          }}
          className="flex flex-col items-center w-full"
        >
          <input
            type="text"
            placeholder="Diary Name"
            className="w-full h-10 mt-5"
            step="any"
            onChange={(e) => {
              setFormData({ ...formData, diaryName: e.target.value });
            }}
          ></input>
          <input
            type="number"
            placeholder="Fee"
            className="w-full h-10 mt-5"
            step="any"
            onChange={(e) => {
              setFormData({ ...formData, fee: e.target.value });
            }}
          ></input>
          <button
            type="submit"
            className="w-1/2 h-10 mt-5 bg-blue-500 rounded-xl"
          >
            Submit
          </button>
        </form>
        <button
          className="w-20 h-10 bg-blue-500"
          onClick={async () => {
            const diaryId = await contract.diaryId();
            console.log(diaryId);
          }}
        >
          Click Here
        </button>

        {allDiaries
          .map((diary, index) => (
            <>
              <div className="flex flex-col w-full">
                <div className="flex flex-row justify-between items-center w-full my-10">
                  <span>Diary Id : {diary.diaryId.toString()}</span>
                  <span>Diary Name : {diary.diaryName}</span>
                  <span>Fee: {diary.pageFee.toString()}</span>
                  <button
                    className="w-20 h-20 bg-blue-500"
                    onClick={() => {
                      console.log({ diary });
                      router.push({
                        pathname: "/NftPage",
                        query: {
                          diaryId: index,
                        },
                      });
                    }}
                  >
                    Mint Button
                  </button>
                  <button
                    className="w-20 h-20 bg-blue-500"
                    onClick={() => {
                      console.log(diary.diaryId.toString());
                    }}
                  >
                    Click Here
                  </button>
                </div>
              </div>
            </>
          ))
          .reverse()}
      </div>
    </div>
  );
};

export default Home;
