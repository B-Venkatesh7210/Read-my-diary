import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/dist/client/router";

const Navbar = () => {

    const router = useRouter();

  return (
    <div className="w-full h-1/7 bg-red-500 flex flex-row justify-between px-2 py-4">
      <div>Hello</div>
      <button className="w-80 h-25 bg-blue-400 rounded-lg" onClick={() => {router.push("/")}}>Read My Diary</button>
      <ConnectButton showBalance={false}></ConnectButton>
    </div>
  );
};

export default Navbar;
