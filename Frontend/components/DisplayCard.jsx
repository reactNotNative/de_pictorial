import React, { useEffect, useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { Badge, Button, Modal } from "@mantine/core";
import Router from "next/router";
import { mediaInfoAtom } from "../store/global";
import { useAtom } from "jotai";
import Form from "../components/Form";
const DisplayCard = ({
  image,
  AssetType,
  Id,
  ItemType,
  Owner,
  licenseIds,
  metaData,
  isOwner = false,
  LicenseData = false,
}) => {
  const [cardImage, SetcardImage] = useAtom(mediaInfoAtom);
  const [obj, setObj] = useState(null);
  const [opened, setOpened] = useState(false);
  useEffect(() => {
    let newMetaData = metaData.replace(
      "ipfs://",
      "https://cloudflare-ipfs.com/ipfs/"
    );

    fetch(newMetaData)
      .then((res) => res.json())
      .then((data) => {
        let newImageLink = data.image.replace(
          "ipfs://",
          "https://cloudflare-ipfs.com/ipfs/"
        );
        let obj = {
          AssetType: AssetType,
          Id: Id,
          ItemType: ItemType,
          Owner: Owner,
          licenseIds: licenseIds,
          collection: data["collection"],
          description: data["description"],
          image: newImageLink,
          price: data["price"],
          mediaType: data["mediaType"],
          name: data["name"],
          tags: data["tags"],
        };
        setObj(obj);
        SetcardImage([...cardImage, obj]);
      });
  }, []);

  return (
    <div className="inline-flex shrink-0 flex-col space-y-5 select-none items-start justify-start w-80 px-5 py-8 border-2 rounded-2xl border-gray-400">
      <div className="flex flex-col items-center justify-end  w-full rounded-2xl">
        <div
          className={`inline-flex items-end grow justify-center rounded-lg h-72 px-4 pb-4 w-full object-cover `}
          style={{
            backgroundSize: "contain",
            background: ` linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0) 73.23%, #000000 100%) , url(${obj?.image}) center center/cover no-repeat fixed`,
          }}
        >
          <div className="flex  items-center justify-between w-full">
            <div className="flex space-x-2.5 items-center justify-start w-full">
              <img
                className="w-10 h-10 border rounded-full border-gray-50"
                src={`https://api.dicebear.com/5.x/pixel-art/svg?seed=${obj?.Owner.toUpperCase()}&options[mood][]=happy`}
              />
              <div className="inline-flex flex-col space-y-0.5 items-start justify-between h-full py-0.5">
                <p className="text-xs font-medium leading-none text-gray-400">
                  Created by
                </p>
                <p className="text-base font-bold leading-tight text-gray-50">
                  {obj?.Owner?.slice(0, 4)} ...{" "}
                  {obj?.Owner?.slice(
                    obj?.Owner?.length - 4,
                    obj?.Owner?.length
                  )}
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
            {obj?.name} # {obj?.Id.toNumber()}
          </p>
          <div className="inline-flex space-x-1 py-2 items-start justify-start w-full">
            {obj?.tags?.map((tag, id) => (
              <Badge color="gray" variant="outline" key={id}>
                {tag.slice(0, 4)}
              </Badge>
            ))}
          </div>
        </div>
        <Button
          onClick={() => Router.push(`/media/${obj?.Id}`)}
          className="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500"
          size="md"
          color="gray"
          styles={{
            root: { border: "none" },
          }}
        >
          View Media
        </Button>
      </div>
      <Button
        onClick={() => setOpened(true)}
        size="md"
        color="dark"
        styles={{
          root: { border: "none", width: "100%" },
        }}
      >
        Airdrop
      </Button>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
      >
        <Form LicenseData={LicenseData} />
      </Modal>
    </div>
  );
};

export default DisplayCard;
