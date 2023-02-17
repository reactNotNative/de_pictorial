import React, { useEffect, useState } from 'react';
import { AiOutlineHeart } from 'react-icons/ai';
import { Badge, Button } from '@mantine/core';
import Router from 'next/router';
import { mediaInfoAtom } from '../store/global';
import { useAtom } from 'jotai';
const DisplayCard = ({
  // image,
  AssetType,
  Id,
  ItemType,
  Owner,
  licenseIds,
  metaData,
}) => {
  const [cardImage, SetcardImage] = useAtom(mediaInfoAtom);
  useEffect(() => {
    //fetch from metadata
    // console.log(image);
    // metaData &&
    let newMetaData = metaData?.replace(
      'ipfs://',
      'https://cloudflare-ipfs.com/ipfs/'
    );

    metaData &&
      fetch(newMetaData)
        .then((res) => res.json())
        .then((data) => {
          let newImageLink = data.image.replace(
            'ipfs://',
            'https://cloudflare-ipfs.com/ipfs/'
          );
          console.log(newImageLink);
          let obj = {
            AssetType: AssetType,
            Id: Id,
            ItemType: ItemType,
            Owner: Owner,
            licenseIds: licenseIds,
            collection: data.collection,
            description: data.description,
            image: newImageLink,
            price: data.price,
            mediaType: data.mediaType,
            name: data.name,
            tags: data.tags,
          };
          // SetcardImage();
          cardImage &&
            SetcardImage((cardImage) =>
              // add obj with key as obj.Id and value as obj to cardImage
              Object.assign(cardImage, { [obj.Id]: obj })
            );
        });
  }, []);
  // print cardImage
  useEffect(() => {
    console.log('cardImage', cardImage);
  }, [cardImage]);

  return (
    cardImage && (
      <div className="inline-flex shrink-0 flex-col space-y-5 select-none items-start justify-start w-80 px-5 py-8 border-2 rounded-2xl border-gray-400">
        <div className="flex flex-col items-center justify-end  w-full rounded-2xl">
          <div
            className="inline-flex items-end grow justify-center rounded-lg h-72 px-4 pb-4 w-full object-cover"
            style={{
              backgroundSize: 'contain',
              background: ` linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0) 73.23%, #000000 100%), url(${cardImage[Id]?.image}) center center/cover no-repeat fixed`,
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
                    {cardImage[Id]?.Owner?.slice(
                      // first 6 characters
                      0,
                      4
                    )}{' '}
                    ...{' '}
                    {cardImage[Id]?.Owner?.slice(
                      // last 4 characters
                      cardImage[Id]?.Owner?.length - 4,
                      cardImage[Id]?.Owner?.length
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
              {cardImage[Id]?.name}
            </p>
            <div className="inline-flex space-x-1 py-2 items-start justify-start w-full">
              {cardImage[Id]?.tags?.map((tag) => (
                <Badge color="gray" variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <Button
            onClick={() => Router.push(`/media/${Id}`)}
            className="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500"
            size="md"
            color="gray"
            styles={{
              root: { border: 'none' },
            }}
          >
            View Media
          </Button>
        </div>
      </div>
    )
  );
};

export default DisplayCard;
