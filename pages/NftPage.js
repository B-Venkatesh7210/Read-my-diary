import React, { useEffect, useState } from "react";
import { NFTStorage, File } from "nft.storage";
import { useRouter } from "next/router";
import { useAccount, useSigner, useContract } from "wagmi";
import { useDiaryStore } from "../state/store";
import nftContractConfig from "../nftContractConfig.json";
import html2canvas from "html2canvas";
import Navbar from "../components/Navbar";
import Image from "next/image";
import NftComponent from "../components/NftComponent";

const NftPage = () => {
  const { isConnected, address } = useAccount();
  const router = useRouter();
  const allDiaries = useDiaryStore((state) => state.allDiaries);
  const { data: signer, isError, isLoading } = useSigner();
  const [diaryId, setDiaryId] = useState();
  const printRef = React.useRef();
  const nftContract = useContract({
    addressOrName: nftContractConfig.address,
    contractInterface: nftContractConfig.abi,
    signerOrProvider: signer,
  });

  useEffect(() => {
    console.log({ allDiaries });
  }, [allDiaries]);

  const client = new NFTStorage({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGY1NDA5NDlFYkE5Rjg4NUJCNDRDMzI5ODVkMDMwODU4N0IzODBiMDQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MzQxMTkxODgwOCwibmFtZSI6IlJlYWRNeURpYXJ5TkZUIn0.hgzEi1e5nLCXvNgGEfg2Bg_OnUuR_e4ArMK2jW9ACFY",
  });

  const handleDownloadImage = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element);

    canvas.toBlob(async (blob) => {
      let file = new File(
        [blob],
        `ReadMyDiaryNFT_${allDiaries[diaryId].diaryName}.png`,
        { type: "image/png" }
      );
      console.log(file);
      var url = window.URL.createObjectURL(file);
      window.location.assign(url);

      const metadata = await client.store({
        name: `${allDiaries[diaryId].diaryName} NFT`,
        image: file,
        description: `${allDiaries[diaryId].description}`,
      });

      console.log("metadata:", metadata.ipnft);
      try {
        const createToken = nftContract.createToken(metadata.url, diaryId);

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

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const diaryId = searchParams.get("diaryId");
    setDiaryId(diaryId);
  }, []);

  return (
    <div className="background h-screen w-full noScrollbar overflow-auto flex flex-col justify-start items-center">
      <Navbar />
      <div className="h-5/6 w-3/5 flex flex-row justify-around items-center">
        <div ref={printRef}>
          <NftComponent diary={allDiaries[diaryId]} />
        </div>
        <div className="h-2/5 flex flex-col justify-center items-center">
          <button
            className="button w-48 flex flex-row justify-center items-center mt-4"
            style={{
              fontSize: "24px",
              height: "60px",
              borderRadius: "20px",
            }}
          >
            <span className="title text-2xl" onClick={handleDownloadImage}>Mint NFT</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NftPage;
