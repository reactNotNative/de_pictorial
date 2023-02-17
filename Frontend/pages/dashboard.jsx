import FOG from 'vanta/dist/vanta.fog.min.js';
import React, { useState, useEffect, useRef } from 'react';
import { createStyles, Avatar, Text, Group } from '@mantine/core';
import { AiFillPhone, AiAt } from 'react-icons/ai';
import NewItemForm from '../components/NewItemForm';
import LicenceForm from '../components/LicenceForm';
import Draggable from '../components/Draggable';
import DisplayCard from './../components/DisplayCard';
import { Button } from '@mantine/core';
import {
  getContract,
  getAllLicences,
  getUserDetails,
  isUserRegistered,
  registerUser1,
  createLicence,
  createDeItem,
} from '../utilities/contractfunctions';
import { mediaInfoAtom, userDataAtom } from '../store/global';
import { useAtom } from 'jotai';
import { ethers } from 'ethers';
const dashboard = () => {
  const myRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isLicenceModalOpen, setIsLicenceModalOpen] = useState(false);
  const [userDetails, setUserDetails] = useAtom(userDataAtom);
  const [cardImage, SetcardImage] = useAtom(mediaInfoAtom);

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
  const { classes } = useStyles();

  const [account, setAccount] = useState(null);

  const checkWalletConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Install Metamask');
      return;
    }
    const accounts = await ethereum.request({
      method: 'eth_accounts',
    });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found Account, ', account);
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let network = await provider.getNetwork();
      setAccount(account);
      if (network.name !== 'maticmum') {
        console.log('Wrong network');
      } else {
        console.log('maticmum connected');
      }
    } else {
      console.log('Create a Ethereum Account');
    }
  };

  // print cardImage
  useEffect(() => {
    console.log('cardImage', cardImage);
  }, [cardImage]);
  useEffect(() => {
    getContract();
    checkWalletConnected();
    isUserRegistered().then((res) => {
      // setUserRegistered(res);

      console.log('res IS USER REGISTERED: ', res);
      if (res) {
        console.log('in if');
        getUserDetails().then((res) => {
          console.log('USER DETAILS: ', res);
          setUserDetails(res);
        });
      }
    });
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
      className="flex flex-col items-center w-screen h-full pt-24 gap-10"
      ref={myRef}
    >
      <section className="container inline-flex flex-col items-start  gap-20 p-10 mx-auto">
        <div className="flex">
          <div>
            <Group noWrap className="h-full">
              <Avatar
                src="https://cdn.discordapp.com/attachments/1006199923374559362/1064433612528824361/CYBERPUNK_Farhaj_person_with_no_spectacles_wearing_brown_jacket_8db751da-a0ca-4dd0-9b6f-cb3823076b38.png"
                size={154}
                radius="md"
              />
              <div className="flex flex-col h-full">
                <Text
                  size="xs"
                  sx={{ textTransform: 'uppercase' }}
                  weight={700}
                  color="dimmed"
                >
                  Username
                </Text>

                <Text size="xl" weight={500}>
                  Wallet Address{' '}
                </Text>
              </div>
            </Group>
          </div>
        </div>
      </section>
      {/* ToDo: Add a check to see if the user is registered or not */}
      {1 && (
        <section className="container w-[95%] backdrop-blur-md bg-opacity-10 rounded-xl bg-white mx-auto p-5 inline-flex flex-col gap-10 items-start justify-center">
          <div className="inline-flex items-end justify-between w-full space-x-5">
            <p className="text-4xl font-bold leading-10">Uploaded Items</p>
            <Button
              onClick={() => setIsItemModalOpen(true)}
              size="md"
              className="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500"
              styles={{
                root: { border: 'none' },
              }}
            >
              Upload
            </Button>
          </div>
          <div className="flex w-full gap-10 overflow-x-auto">
            <Draggable className={classes.draggable}>
              <>
                {userDetails &&
                  userDetails['atomicDetails']?.map((image, id) => {
                    // useEffect(() => {
                    //fetch from metadata
                    // console.log(image);
                    // metaData &&
                    // let newMetaData = image.metaData?.replace(
                    //   'ipfs://',
                    //   'https://cloudflare-ipfs.com/ipfs/'
                    // );

                    // image.metaData &&
                    //   fetch(newMetaData)
                    //     .then((res) => res.json())
                    //     .then((data) => {
                    //       let newImageLink = data.image.replace(
                    //         'ipfs://',
                    //         'https://cloudflare-ipfs.com/ipfs/'
                    //       );
                    //       console.log(newImageLink);
                    //       // image={image}
                    //       //                 AssetType={image.AssetType}
                    //       //                 Id={image.Id}
                    //       //                 ItemType={image.ItemType}
                    //       //                 Owner={image.Owner}
                    //       //                 licenseIds={image.licenseIds}
                    //       //                 metaData={image.metaData}
                    //       let obj = {
                    //         AssetType: image.AssetType,
                    //         Id: image.Id,
                    //         ItemType: image.ItemType,
                    //         Owner: image.Owner,
                    //         licenseIds: image.licenseIds,
                    //         collection: data.collection,
                    //         description: data.description,
                    //         image: newImageLink,
                    //         price: data.price,
                    //         mediaType: data.mediaType,
                    //         name: data.name,
                    //         tags: data.tags,
                    //       };
                    //       // SetcardImage();
                    //       cardImage &&
                    //         SetcardImage((cardImage) =>
                    //           // add obj with key as obj.Id and value as obj to cardImage
                    //           Object.assign(cardImage, { [obj.Id]: obj })
                    //         );
                    //     });
                    // }, []);

                    return (
                      <div className={classes.card} key={id}>
                        <DisplayCard
                          // image={image}
                          AssetType={image.AssetType}
                          Id={cardImage.Id}
                          ItemType={image.ItemType}
                          Owner={image.Owner}
                          licenseIds={image.licenseIds}
                          metaData={image.metaData}
                        />
                      </div>
                    );
                  })}
              </>
            </Draggable>
          </div>
        </section>
      )}
      {1 && (
        <section className="container w-[95%] backdrop-blur-md bg-opacity-10 rounded-t-xl bg-white mx-auto p-5 inline-flex flex-col gap-10 items-start justify-center">
          <div className="inline-flex items-end justify-between w-full space-x-5">
            <p className="text-4xl font-bold leading-10">Purchased Licenses</p>
            <Button
              onClick={() => setIsLicenceModalOpen(true)}
              size="md"
              className="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500"
              styles={{
                root: { border: 'none' },
              }}
            >
              Create License
            </Button>
          </div>
          <div className="flex w-full gap-10 overflow-x-auto">
            <Draggable className={classes.draggable}>
              <>
                {[...Array(10)].map((image, id) => (
                  <div className={classes.card} key={id}>
                    <DisplayCard image={image} />
                  </div>
                ))}
              </>
            </Draggable>
          </div>
        </section>
      )}
      {1 && (
        <section className="container w-[95%] backdrop-blur-md bg-opacity-10 rounded-xl bg-white mx-auto p-5 inline-flex flex-col gap-10 items-start justify-center">
          <Button
            onClick={() => registerUser1(account)}
            size="md"
            className="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500"
            styles={{
              root: { border: 'none' },
            }}
          >
            Register
          </Button>
        </section>
      )}
      {/* <Button onClick={() => setIsLicenceModalOpen(true)}>Licence</Button>
      <Button onClick={() => setIsItemModalOpen(true)}>Deitem</Button> */}
      <NewItemForm
        isItemModalOpen={isItemModalOpen}
        setIsModalOpen={setIsItemModalOpen}
        createDeItem={createDeItem}
        // userDetails={userDetails}
      />
      <LicenceForm
        isLicenceModalOpen={isLicenceModalOpen}
        setIsLicenceModalOpen={setIsLicenceModalOpen}
        createLicence={createLicence}
        userDetails={userDetails}
      />
    </div>
  );
};

export default dashboard;
