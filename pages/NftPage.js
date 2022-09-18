import React, { useEffect, useState } from "react";
import { NFTStorage, File } from "nft.storage";
import { useRouter } from "next/router";
import { useAccount, useSigner, useContract } from "wagmi";
import { useDiaryStore } from "../state/store";
import Image from "next/image";
import nftContractConfig from "../nftContractConfig.json";
import html2canvas from "html2canvas";
import NftComponent from "../components/NftComponent";

const NftPage = () => {
  const { isConnected, address } = useAccount();
  const router = useRouter();
  const allDiaries = useDiaryStore((state) => state.allDiaries);
  const { data: signer, isError, isLoading } = useSigner();
  const diaryId = router.query.diaryId;
  const printRef = React.useRef();
  const nftContract = useContract({
    addressOrName: nftContractConfig.address,
    contractInterface: nftContractConfig.abi,
    signerOrProvider: signer,
  });

  useEffect(() => {
    console.log({ allDiaries: allDiaries[diaryId] });
  }, []);

  const client = new NFTStorage({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGY1NDA5NDlFYkE5Rjg4NUJCNDRDMzI5ODVkMDMwODU4N0IzODBiMDQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MzQxMTkxODgwOCwibmFtZSI6IlJlYWRNeURpYXJ5TkZUIn0.hgzEi1e5nLCXvNgGEfg2Bg_OnUuR_e4ArMK2jW9ACFY",
  });

  const handleDownloadImage = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element);

    canvas.toBlob(async (blob) => {
      let file = new File([blob], "ReadMyDiaryNFT.png", { type: "image/png" });
      const metadata = await client.store({
        name: "Read My Diary NFT",
        image: file,
        description: "trial NFT",
      });

      console.log("metadata:", metadata.ipnft);
      try {
        const createToken = nftContract.createToken(metadata.url, 1);

        // createToken.on("transactionHash", (hash) => {
        //   console.log(hash);
        // });

        // createToken.on("error", (error, recipt) => {
        //   console.log(error);
        //   alert(error);
        // });
      } catch (error) {
        alert(error.message);
      }
    });
  };

  return (
    <div className="flex flex-col h-screen w-1/2 bg-red-500 top-1/2 left-1/2">
      <button
        className="w-20 h-10 bg-blue-300 rounded"
        onClick={() => {
          console.log(address);
        }}
      >
        Click Here
      </button>{" "}
      {/* <Image
          alt="Nft"
          src="/images/NftImage.jpg"
          width="280"
          height="220"
        ></Image> */}
      <div ref={printRef} className="w-1/3 h-1/2 bg-blue-500 flex flex-col justify-center items-center p-10">
        <Image
          alt="Nft"
          src="/images/NftImage.jpg"
          width="200"
          height="200"
        ></Image>
      </div>
      <button
        className="w-20 h-20 bg-blue-300 rounded"
        onClick={handleDownloadImage}
      >
        Mint your NFT
      </button>
      {/* <span>Diary Name: {allDiaries[diaryId].diaryName}</span>
      <span>Diary Author: {allDiaries[diaryId].author}</span> */}
    </div>
  );
};

export default NftPage;
