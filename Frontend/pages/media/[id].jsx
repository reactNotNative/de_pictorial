import React, { useState, useEffect, useRef } from "react";
import { Badge, Button } from "@mantine/core";
import { AiOutlineHeart } from "react-icons/ai";
import FOG from "vanta/dist/vanta.fog.min.js";
import SubscriptionLabel from './../../components/SubscriptionLabel';

const index = () => {
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
    <div
      className="w-screen h-screen flex pt-24 overflow-hidden items-center"
      ref={myRef}
    >
      <div className="inline-flex gap-10 container mx-auto w-full h-full items-start justify-start px-10 py-12 rounded-2xl">
        <div className="inline-flex flex-col items-center justify-end px-4 py-4 bg-black rounded-xl h-full w-full"></div>
        <div className="inline-flex flex-col space-y-5 items-start justify-between w-5/12 h-full">
          <div className="flex flex-col space-y-5 items-start justify-start">
            <div className="w-full">
              <div className="inline-flex flex-col space-y-0.5 items-start justify-start flex-1 h-full w-full">
                <div className="inline-flex space-x-2.5 items-center justify-between w-full">
                  <p className="text-2xl font-bold leading-loose text-gray-300">
                    Anna Haidak
                  </p>
                  <AiOutlineHeart size="24" className="text-white" />
                </div>
                <div className="inline-flex gap-2 items-start justify-start w-40">
                  <Badge color="gray" variant="outline">
                    Badge
                  </Badge>
                  <Badge color="gray" variant="outline">
                    Badge
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start justify-start w-full">
              <p className="text-sm font-semibold leading-tight text-gray-300">
                ABOUT
              </p>
              <p className="w-full text-xs font-medium leading-none text-gray-400">
                20-year-old BTech student with a deep passion for technology and
                app development. I am constantly seeking to learn and grow in
                this field, and I am particularly interested in the development
                of innovative and impactful apps.
              </p>
            </div>
            <div className="inline-flex space-x-5 items-start justify-between w-full">
              <div className="flex space-x-2.5 items-center justify-start">
                <img
                  className="w-10 h-10 border rounded-full border-gray-300"
                  src="https://via.placeholder.com/40x40"
                />
                <div className="inline-flex flex-col space-y-0.5 items-start justify-between h-full py-0.5">
                  <p className="text-xs font-medium leading-none text-gray-400">
                    Created by
                  </p>
                  <p className="text-base font-bold leading-tight text-gray-300">
                    Anna Haidak
                  </p>
                </div>
              </div>
              <div className="inline-flex flex-col items-end justify-end h-full py-0.5">
                <p className="text-xs leading-none text-gray-400">
                  Published on
                </p>
                <p className="text-xs font-medium leading-none text-right text-gray-300">
                  31-12-2023
                </p>
              </div>
            </div>
          </div>
          <div className="inline-flex w-full">
            <SubscriptionLabel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
