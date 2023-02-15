import Typewriter from 'typewriter-effect';
import { AiOutlineSearch, AiOutlineArrowRight } from 'react-icons/ai';
import React, { useState, useEffect, useRef } from 'react';
import FOG from 'vanta/dist/vanta.fog.min.js';
import DisplayCard from './../components/DisplayCard';
import {
  TextInput,
  ActionIcon,
  useMantineTheme,
  createStyles,
} from '@mantine/core';
import Draggable from '../components/Draggable';
import { useAtom } from 'jotai';
import { userData } from '../store/global';

const useStyles = createStyles((theme) => ({
  draggable: {
    display: 'flex',
    marginBottom: '16px',
    overflowX: 'auto',
    gap: '20px',
    width: '100%',
    cursor: 'pointer',
    scrollbarWidth: 'none',
    padding: '8px 0',

    '&::-webkit-scrollbar': {
      height: '5px',
    },

    '&::-webkit-scrollbar-track': {
      backgroundColor: '#302c2c',
    },

    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#b8b3b3',
    },
  },
}));

const Home = () => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const { classes } = useStyles();
  const [user, setUser] = useAtom(userData);
  const theme = useMantineTheme();

  console.log(user);

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
      <div className="flex flex-col items-center w-screen h-full" ref={myRef}>
        <section className="container inline-flex flex-col items-start justify-center min-h-screen gap-20 p-10 mx-auto">
          <div className="flex flex-col items-start justify-center gap-3 text-left">
            <div className="inline-flex items-center justify-between space-x-5 font-bold text-white text-8xl">
              {/* <p className="-ml-8 font-bold text-white text-8xl">
                Your Media, Your Licence
              </p> */}
              <span className="font-semibold">Decentralizing </span>
              <Typewriter
                options={{
                  strings: ['Ownership', 'Media', 'Licences'],
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
                '&:hover': { borderColor: 'white' },
                '&:focus': { borderColor: 'white' },
                background: 'none',
                borderWidth: '4px',
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
        <section className="container w-[95%] backdrop-blur-sm bg-opacity-10 rounded-t-xl bg-white mx-auto p-5 inline-flex flex-col gap-10 items-start justify-center min-h-screen">
          <div className="inline-flex items-end justify-start space-x-5">
            <p className="text-4xl font-bold leading-10">Featured</p>
            <p className="text-base font-bold leading-tight text-gray-400">
              See all
            </p>
          </div>
          <div className="flex w-full gap-10 overflow-x-auto">
            <Draggable className={classes.draggable}>
              <>
                {[...Array(10)].map(() => (
                  <div className={classes.card}>
                    <DisplayCard />
                  </div>
                ))}
              </>
            </Draggable>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
