import React from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { Badge, Button } from "@mantine/core";

const DisplayCard = () => {
  return (
    <div className="inline-flex shrink-0 flex-col space-y-5 items-start justify-start w-80 px-5 py-8 border-2 rounded-2xl border-gray-400">
      <div className="flex flex-col items-center justify-end  w-full rounded-2xl">
        <div
          className="inline-flex items-end grow justify-center rounded-lg h-72 px-4 pb-4 w-full object-contain"
          style={{
            backgroundSize: "contain",
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0) 73.23%, #000000 100%),url(https://lexica-serve-encoded-images2.sharif.workers.dev/md2/14760351-93af-45f4-804c-75b75a807517)",
          }}
        >
          <div className="flex  items-center justify-between w-full">
            <div className="flex space-x-2.5 items-center justify-start w-full">
              <img
                className="w-10 h-10 border rounded-full border-gray-50"
                src="https://via.placeholder.com/40x40"
              />
              <div className="inline-flex flex-col space-y-0.5 items-start justify-between h-full py-0.5">
                <p className="text-xs font-medium leading-none text-gray-400">
                  Created by
                </p>
                <p className="text-base font-bold leading-tight text-gray-50">
                  Anna Haidak
                </p>
              </div>
            </div>
            <AiOutlineHeart size="42" className="text-white" />
          </div>
        </div>
      </div>
      <div className="inline-flex  items-center justify-between w-full">
        <div className="inline-flex flex-col space-y-0.5 items-start justify-start h-full">
          <p className="text-base font-bold leading-tight text-white">
            Anna Haidak
          </p>
          <div className="inline-flex space-x-1 py-2 items-start justify-start w-full">
            <Badge color="gray" variant="outline">
              Badge
            </Badge>
            <Badge color="gray" variant="outline">
              Badge
            </Badge>
          </div>
        </div>
        <Button variant="outline" size="md" color="gray">
          0.5 Mat
        </Button>
      </div>
    </div>
  );
};

export default DisplayCard;
