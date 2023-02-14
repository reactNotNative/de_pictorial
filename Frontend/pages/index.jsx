import Hero from '../components/Hero';
import Typewriter from 'typewriter-effect';
import { Input } from '@nextui-org/react';
import { AiOutlineSearch } from 'react-icons/ai';
import React, { useState, useEffect, useRef } from 'react';
import FOG from 'vanta/dist/vanta.fog.min.js';

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
      <div className="w-screen h-screen flex items-center" ref={myRef}>
        <section className="container mx-auto p-10 inline-flex flex-col gap-20 items-start justify-center min-h-screen">
          <div className="flex flex-col items-start justify-center gap-3 text-left">
            <div className="inline-flex space-x-5 items-center justify-between text-8xl font-bold text-white">
              {/* <p className="text-8xl font-bold -ml-8 text-white">
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
            <div className="inline-flex space-x-5 items-center justify-end">
              <p className="text-7xl font-bold shadow-fuchsia-500 text-center ">
                Liberty for Creativity
              </p>
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
