import Hero from "../components/Hero";
import { Input } from "@nextui-org/react";
import { AiOutlineSearch } from "react-icons/ai";
import React, { useState, useEffect, useRef } from "react";
import FOG from "vanta/dist/vanta.fog.min.js";

const Home = () => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const myRef = useRef(null);
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        FOG({
          el: myRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          highlightColor: 0x424242,
          midtoneColor: 0x0,
          lowlightColor: 0x9d9d9d,
          baseColor: 0x0,
          blurFactor: 0.2,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);
  return (
    <>
      {/* <Hero /> */}
      <div className="w-screen h-screen flex items-center" ref={myRef}>
        <section className="container  mx-auto p-10 inline-flex flex-col gap-20 items-center justify-center min-h-screen">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="inline-flex space-x-5 items-center justify-between">
              <p className="text-9xl font-bold  text-white">Web3 way to</p>
            </div>
            <div className="inline-flex space-x-5 items-center justify-end">
              <p className="text-9xl font-bold text-center ">buy and sell</p>
            </div>
          </div>

          <Input
            labelLeft={<AiOutlineSearch size="2rem" />}
            bordered
            placeholder="Search by item, author, category"
            color="default"
            width="60%"
            size="xl"
          />
        </section>
      </div>
    </>
  );
};

export default Home;
