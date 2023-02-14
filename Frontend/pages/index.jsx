import Typewriter from "typewriter-effect";
import { AiOutlineSearch, AiOutlineArrowRight } from "react-icons/ai";
import React, { useState, useEffect, useRef } from "react";
import FOG from "vanta/dist/vanta.fog.min.js";
import DisplayCard from "./../components/DisplayCard";
import {
  TextInput,
  TextInputProps,
  ActionIcon,
  useMantineTheme,
} from "@mantine/core";

const Home = () => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const theme = useMantineTheme();

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
          blurFactor: 0.3,
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
      <div className="w-screen h-full flex flex-col items-center" ref={myRef}>
        <section className="container mx-auto p-10 inline-flex flex-col gap-20 items-start justify-center min-h-screen">
          <div className="flex flex-col items-start justify-center gap-3 text-left">
            <div className="inline-flex space-x-5 items-center justify-between text-8xl font-bold text-white">
              {/* <p className="text-8xl font-bold -ml-8 text-white">
                Your Media, Your Licence
              </p> */}
              <span className="font-semibold">Decentralizing </span>
              <Typewriter
                options={{
                  strings: ["Ownership", "Media", "Licences"],
                  deleteSpeed: 40,
                  autoStart: true,
                  loop: true,
                }}
              />
            </div>
            <div className="inline-flex space-x-5 items-center justify-end">
              <p className="text-7xl font-bold shadow-fuchsia-500 text-center ">
                Liberty for Creativity
              </p>
            </div>
          </div>

          <TextInput
            icon={<AiOutlineSearch size="2rem" />}
            radius="lg"
            size="xl"
            className="w-1/2"
            styles={{
              input: {
                "&:hover": { borderColor: "white" },
                "&:focus": { borderColor: "white" },
                background: "none",
                borderWidth: "4px",
              },
            }}
            rightSection={
              <ActionIcon
                size="xl"
                radius="md"
                color={theme.primaryColor}
                variant="filled"
              >
                <AiOutlineArrowRight size="2rem" />
              </ActionIcon>
            }
            rightSectionWidth={64}
            placeholder="Search by item, author, category"
          />
        </section>
        <section className="container mx-auto p-10 inline-flex flex-col gap-10 items-start justify-center min-h-screen">
          <div className="inline-flex space-x-5 items-end justify-start">
            <p className="text-4xl font-bold leading-10">Featured</p>
            <p className="text-base font-bold leading-tight text-gray-400">
              See all
            </p>
          </div>
          <div className="flex gap-10 overflow-x-auto w-full">
            {" "}
            {[...Array(10)].map(() => (
              <DisplayCard />
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
