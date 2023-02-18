import { useState, useRef, useEffect } from 'react';
import {
  SegmentedControl,
  TextInput,
  Button,
  Select,
  Grid,
  createStyles,
} from '@mantine/core';
import FOG from 'vanta/dist/vanta.fog.min.js';
import { AiOutlineSearch, AiOutlineArrowRight } from 'react-icons/ai';
import thumbnail from '../constants/images';
import DisplayCard from './../components/DisplayCard';
import Draggable from './../components/Draggable';
import { getDeItemById, getAllAtomics } from '../utilities/contractfunctions';
const useStyles = createStyles((theme) => ({
  draggable: {
    display: 'flex',
    marginBottom: '16px',
    overflowX: 'auto',
    gap: '20px',
    width: '100%',
    cursor: 'pointer',
    padding: '8px 0',
  },
}));
const categories = () => {
  const myRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [value, setValue] = useState('react');
  const { classes } = useStyles();
  const [obj, setObj] = useState(null);
  const [error, setError] = useState(null);

  function getMetadata(res) {
    res.map((item) => {
      let metadata = item['deItemDetails']['metaData'];
      let newMetaData = metadata.replace(
        'ipfs://',
        'https://cloudflare-ipfs.com/ipfs/'
      );
      fetch(newMetaData)
        .then((res) => res.json())
        .then((data) => {
          let newImageLink = data.image.replace(
            'ipfs://',
            'https://cloudflare-ipfs.com/ipfs/'
          );
          let obj = {
            AssetType: res['deItemDetails']['AssetType'],
            Id: res['deItemDetails']['Id'],
            ItemType: res['deItemDetails']['ItemType'],
            Owner: res['deItemDetails']['Owner'],
            licenseDetails: res['licenseDetails'],
            purchaseDetails: res['purchaseDetails'],
            collection: data['collection'],
            description: data['description'],
            image: newImageLink,
            mediaType: data['mediaType'],
            name: data['name'],
          };
          setObj(obj);
        });
    });
  }
  function getAllMedia() {
    getAllAtomics().then((res) => {
      console.log('RES: ', res);
      // getMetadata(res);
    });
  }

  useEffect(() => {
    try {
      getAllMedia();
    } catch (err) {
      setError(err);
    }
  }, []);

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
      className="flex flex-col items-center w-screen h-full pt-24"
      ref={myRef}
    >
      <section className="container inline-flex flex-col items-start justify-start min-h-screen gap-20 p-10 mx-auto">
        <div className="flex items-end justify-between w-full">
          <div className="w-full">
            <SegmentedControl
              value={value}
              onChange={setValue}
              size="md"
              radius="md"
              data={[
                { label: 'Photo', value: 'Photo' },
                { label: 'Video', value: 'Video' },
                { label: 'Memes', value: 'Meme' },
                { label: 'Audio', value: 'Audio' },
              ]}
              transitionDuration={500}
              transitionTimingFunction="linear"
              styles={{
                active: {
                  background:
                    'linear-gradient(to right, rgb(251, 113, 133), rgb(217, 70, 239), rgb(99, 102, 241))',
                },
                root: { background: 'none', border: '1px solid white' },
                control: { border: 'none' },
              }}
            />
          </div>
          <div className="w-full">
            <TextInput
              icon={<AiOutlineSearch size="2rem" />}
              radius="lg"
              size="lg"
              className="w-full"
              styles={{
                input: {
                  '&:hover': { borderColor: 'white' },
                  '&:focus': { borderColor: 'white' },
                  background: 'none',
                  borderWidth: '2px',
                },
              }}
              rightSection={
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500"
                  styles={{
                    root: { border: 'none', padding: '2px 6px' },
                  }}
                >
                  <AiOutlineArrowRight size="1.5rem" />
                </Button>
              }
              rightSectionWidth={64}
              placeholder="Search by item, author, category"
            />
          </div>
          <div className="w-full flex justify-end">
            <Select
              //   label="Sort By"
              placeholder="Sort By"
              data={[
                { value: 'Price', label: 'Price' },
                { value: 'Trending', label: 'Trending' },
                { value: 'Likes', label: 'Likes' },
              ]}
            />
          </div>
        </div>
        <div className="flex flex-col gap-10 w-full">
          <section className="container backdrop-blur-md bg-opacity-10 rounded-xl bg-white mx-auto p-5 inline-flex flex-col gap-6 items-start justify-center">
            <div className="inline-flex items-end justify-start space-x-5">
              <p className="text-4xl font-bold leading-10">Trending</p>
            </div>
            <div className="flex w-full gap-10 overflow-x-auto">
              <Draggable className={classes.draggable}>
                <>
                  {thumbnail.map((image, id) => (
                    <div className={classes.card} key={id}>
                      {/* <DisplayCard image={image} /> */}
                    </div>
                  ))}
                </>
              </Draggable>
            </div>
          </section>
          <div className="grid grid-cols-4 place-content-center gap-10 w-full items-center">
            {thumbnail.map((image, id) => (
              <div className="mx-auto" key={id}>
                {/* <DisplayCard image={image} /> */}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default categories;
