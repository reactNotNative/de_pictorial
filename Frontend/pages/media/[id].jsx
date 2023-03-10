import React, { useState, useEffect, useRef } from "react";
import { Badge, Button } from "@mantine/core";
import { AiOutlineHeart } from "react-icons/ai";
import FOG from "vanta/dist/vanta.fog.min.js";
import SubscriptionLabel from "./../../components/SubscriptionLabel";
import { useRouter } from "next/router";
import { getDeItemById } from "../../utilities/contractfunctions";
import { toast } from "react-hot-toast";

const index = () => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const [error, setError] = useState(null);
  const [obj, setObj] = useState(null);

  const myRef = useRef(null);
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    if (!router.isReady) return;
    getDeItem();
  }, [router.isReady]);

  function getDeItem() {
    try {
      getDeItemById(id, 0).then((res) => {
        getMetadata(res);
      });
    } catch (err) {
      toast.error(` Error getting media details: ${err["reason"]} `);
      setError(err);
    }
  }
  function getMetadata(res) {
    let metadata = res["deItemDetails"]["metaData"];
    let newMetaData = metadata.replace(
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
          AssetType: res["deItemDetails"]["AssetType"],
          Id: res["deItemDetails"]["Id"],
          ItemType: res["deItemDetails"]["ItemType"],
          Owner: res["deItemDetails"]["Owner"],
          licenseDetails: res["licenseDetails"],
          purchaseDetails: res["purchaseDetails"],
          collection: data["collection"],
          description: data["description"],
          image: newImageLink,
          mediaType: data["mediaType"],
          name: data["name"],
          tags: data["tags"],
        };

        setObj(obj);
      });
  }
  useEffect(() => {
    console.log("obj: ", obj);
  }, [obj]);

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
        <div
          className="inline-flex flex-col items-center justify-end px-4 py-4 bg-black rounded-xl h-full w-full"
          style={{
            // backgroundSize: 'cov',
            background: ` linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0) 73.23%, #000000 100%) , url(${obj?.image}) center center/cover no-repeat fixed`,
          }}
        ></div>
        <div className="inline-flex flex-col space-y-5 items-start justify-between w-5/12 h-full">
          <div className="flex flex-col space-y-5 items-start justify-start">
            <div className="w-full">
              <div className="inline-flex flex-col space-y-0.5 items-start justify-start flex-1 h-full w-full">
                <div className="inline-flex space-x-2.5 items-center justify-between w-full">
                  <p className="text-2xl font-bold leading-loose text-gray-300">
                    {obj?.name} # {obj?.Id.toNumber()}
                  </p>
                  <AiOutlineHeart size="24" className="text-white" />
                </div>
                <div className="inline-flex gap-2 items-start justify-start w-full">
                  {obj?.tags?.map((tag, id) => {
                    return (
                      <Badge color="gray" variant="outline" key={id}>
                        {tag}
                      </Badge>
                    );
                  })}
                  <Badge color="gray" variant="outline" key={id}>
                    {obj?.mediaType}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start justify-start w-full">
              <p className="text-sm font-semibold leading-tight text-gray-300">
                ABOUT
              </p>
              <p className="w-full text-xs font-medium leading-none text-gray-400">
                {obj?.description}
              </p>
            </div>
            <div className="inline-flex space-x-5 items-start justify-between w-full">
              <div className="flex space-x-2.5 items-center justify-start">
                <img
                  className="w-10 h-10 border rounded-full border-gray-300"
                  src={`https://api.dicebear.com/5.x/pixel-art/svg?seed=${obj?.Owner?.toUpperCase()}&options[mood][]=happy`}
                />
                <div className="inline-flex flex-col space-y-0.5 items-start justify-between h-full py-0.5">
                  <p className="text-xs font-medium leading-none text-gray-400">
                    Created by
                  </p>
                  <p className="text-base font-bold leading-tight text-gray-300">
                    {obj?.Owner?.slice(0, 4)} ...{" "}
                    {obj?.Owner?.slice(
                      obj?.Owner?.length - 4,
                      obj?.Owner?.length
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {obj?.["purchaseDetails"] &&
            obj["purchaseDetails"].map((purchase, id) => {
              if (purchase["Buyer"].includes("0x0000000")) return null;
              return (
                <div
                  className="inline-flex space-x-5 items-start justify-between w-full"
                  key={id}
                >
                  <div className="flex space-x-2.5 items-center justify-start">
                    <img
                      className="w-10 h-10 border rounded-full border-gray-300"
                      src={`https://api.dicebear.com/5.x/pixel-art/svg?seed=${obj?.Buyer?.toUpperCase()}&options[mood][]=happy`}
                    />
                    <div className="inline-flex flex-col space-y-0.5 items-start justify-between h-full py-0.5">
                      <p className="text-xs font-medium leading-none text-gray-400">
                        Purchased by
                      </p>
                      <p className="text-base font-bold leading-tight text-gray-300">
                        {purchase["Buyer"].slice(0, 4)} ...{" "}
                        {purchase["Buyer"].slice(
                          purchase["Buyer"].length - 4,
                          purchase["Buyer"].length
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

          <div className="inline-flex w-full flex-wrap justify-evenly gap-4">
            {obj?.["licenseDetails"].map((license, idd) => {
              return (
                <SubscriptionLabel
                  license={license}
                  AssetType={obj?.AssetType}
                  Id={obj?.Id}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
