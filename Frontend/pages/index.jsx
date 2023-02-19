import Typewriter from "typewriter-effect";
import { AiOutlineSearch, AiOutlineArrowRight } from "react-icons/ai";
import React, { useState, useEffect, useRef } from "react";
import FOG from "vanta/dist/vanta.fog.min.js";
import DisplayCard from "./../components/DisplayCard";
import {
  TextInput,
  ActionIcon,
  useMantineTheme,
  createStyles,
  Button,
} from "@mantine/core";
import Draggable from "../components/Draggable";

import thumbnail from "../constants/images";
const useStyles = createStyles((theme) => ({
  draggable: {
    display: "flex",
    marginBottom: "16px",
    overflowX: "auto",
    gap: "20px",
    width: "100%",
    cursor: "pointer",
    padding: "8px 0",
  },
}));

const Home = () => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const { classes } = useStyles();

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
      <div className="flex flex-col items-center w-screen overflow-hidden" ref={myRef}>
        <section className="container inline-flex flex-col items-start justify-center h-screen py-0 gap-20 p-10 mx-auto">
          <div className="flex flex-col items-start justify-center gap-3 text-left">
            <div className="inline-flex items-center justify-between space-x-5 font-bold text-white text-8xl">
              {/* <p className="-ml-8 font-bold text-white text-8xl">
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
            <div className="inline-flex items-center justify-end space-x-5">
              <p className="font-bold text-center text-7xl shadow-fuchsia-500 ">
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
                borderWidth: "2px",
              },
            }}
            rightSection={
              <Button
                size="md"
                className="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500"
                styles={{
                  root: { border: "none", padding: "2px 6px" },
                }}
              >
                <AiOutlineArrowRight size="2rem" />
              </Button>
            }
            rightSectionWidth={64}
            placeholder="Search by item, author, category"
          />
        </section>
        <section className="container w-[95%] backdrop-blur-md bg-opacity-10 rounded-xl bg-white mx-auto p-5 inline-flex flex-col gap-10 items-start justify-center">
          <div className="inline-flex items-end justify-start space-x-5">
            <p className="text-4xl font-bold leading-10">Featured</p>
            <p className="text-base font-bold leading-tight text-gray-400">
              See all
            </p>
          </div>
          <div className="flex w-full gap-10 overflow-x-auto">
            {/* <Draggable className={classes.draggable}>
              <>
                {thumbnail.map((image, id) => (
                  <div className={classes.card} key={id}>
                    <DisplayCard image={image} />
                  </div>
                ))}
              </>
            </Draggable> */}
          </div>
        </section>
        <section className="container w-[95%] backdrop-blur-md mt-20 bg-opacity-10 rounded-xl bg-white mx-auto p-5 inline-flex flex-col gap-10 items-start justify-center">
          <div className="inline-flex items-end justify-start space-x-5">
            <p className="text-4xl font-bold leading-10">Featured</p>
            <p className="text-base font-bold leading-tight text-gray-400">
              See all
            </p>
          </div>
          <div className="flex w-full gap-10 overflow-x-auto">
            {/* <Draggable className={classes.draggable}>
              <>
                {thumbnail.map((image, id) => (
                  <div className={classes.card} key={id}>
                    <DisplayCard image={image} />
                  </div>
                ))}
              </>
            </Draggable> */}
          </div>
        </section>
        {/* <NewItemForm /> */}
      </div>
    </>
  );
};

export default Home;
