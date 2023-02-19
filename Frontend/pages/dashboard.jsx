import FOG from 'vanta/dist/vanta.fog.min.js';
import React, { useState, useEffect, useRef } from 'react';
import { createStyles, Avatar, Text, Group } from '@mantine/core';
import { AiFillPhone, AiAt } from 'react-icons/ai';
import NewItemForm from '../components/NewItemForm';
import LicenceForm from '../components/LicenceForm';
import Draggable from '../components/Draggable';
import DisplayCard from './../components/DisplayCard';
import SubscriptionLabel from './../components/SubscriptionLabel';

import { Button } from '@mantine/core';
import {
  getContract,
  getDeItemById,
  getUserDetails,
  isUserRegistered,
  registerUser1,
  createLicence,
  createDeItem,
} from '../utilities/contractfunctions';
import { isModalOpenAtom, userDataAtom } from '../store/global';
import { useAtom } from 'jotai';
import { providers } from 'ethers';
import { toast } from 'react-hot-toast';
const dashboard = () => {
  const myRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isLicenceModalOpen, setIsLicenceModalOpen] = useState(false);
  const [userDetails, setUserDetails] = useAtom(userDataAtom);
  const [isRegistered, setIsRegistered] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [refetch, setRefetch] = useState(false);
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
      toast.error('Install Metamask');
      return;
    }

    const accounts = await ethereum.request({
      method: 'eth_accounts',
    });

    if (accounts.length !== 0) {
      const account = accounts[0];
      let provider = new providers.Web3Provider(window.ethereum);
      let network = await provider.getNetwork();
      setAccount(account);
      if (network.name !== 'maticmum') {
        toast.error('Wrong Network');
      } else {
        toast.success('Maticum Connected');
      }
    } else {
      toast.error('Create a Ethereum Account');
    }
  };
  function getPurchases(res) {
    let purchases = [];
    for (let i = 0; i < res['purchaseDetails'].length; i++) {
      purchases.push(
        getDeItemById(res['purchaseDetails'][i]['DeItemId'].toNumber(), 0).then(
          (res) => {
            // console.log('Purchases:', res);
            setPurchases((prev) => [...prev, res]);
            return res;
          }
        )
      );
    }
    return purchases;
  }
  useEffect(() => {
    getContract();
    checkWalletConnected();
    isUserRegistered().then((res) => {
      setIsRegistered(res);

      if (res) {
        getUserDetails().then((res) => {
          getPurchases(res);

          setUserDetails(res);
        });
      }
    });
  }, [refetch]);

  useEffect(() => {
    console.log('userDetails:', userDetails);
  }, [userDetails]);

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
      className="flex flex-col items-center w-screen h-full pt-24 gap-10 min-h-screen"
      ref={myRef}
    >
      <section className="container inline-flex flex-col items-start  gap-20 p-10 mx-auto">
        <div className="flex">
          <div>
            <Group noWrap className="h-full">
              <Avatar
                src={`https://api.dicebear.com/5.x/pixel-art/svg?seed=${account?.toUpperCase()}&options[mood][]=happy`}
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
                  Welcome To De'Pictorial
                </Text>

                <Text size="xl" weight={500}>
                  {account?.toUpperCase()}
                </Text>
              </div>
            </Group>
            {!isRegistered && (
              <Button
                onClick={async () => {
                  try {
                    await registerUser1(account);
                    setRefetch(!refetch);
                    toast.success('Registered Successfully');
                  } catch (err) {
                    toast.error(err['reason']);
                  }
                }}
                size="md"
                className="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500"
                styles={{
                  root: { border: 'none' },
                }}
              >
                Register
              </Button>
            )}

            {isRegistered && (
              <div className="inline-flex w-full">
                {userDetails?.['licenseDetails'].map((license, idd) => {
                  return (
                    <div
                      className="inline-flex flex-col space-y-2 items-start justify-start w-1/2"
                      key={idd}
                    >
                      <SubscriptionLabel
                        license={license}
                        AssetType={-1}
                        Id={-1}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
      {isRegistered && (
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
              {userDetails &&
                userDetails['atomicDetails']?.map((image, id) => {
                  return (
                    <div className={classes.card} key={id}>
                      <DisplayCard
                        image={image}
                        AssetType={image['AssetType']}
                        Id={image['Id']}
                        ItemType={image['ItemType']}
                        Owner={image['Owner']}
                        licenseIds={image['licenseIds']}
                        metaData={image['metaData']}
                      />
                    </div>
                  );
                })}
            </Draggable>
          </div>
        </section>
      )}

      {isRegistered && (
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
            {purchases &&
              purchases?.map((image, id) => {
                return (
                  <div className={classes.card} key={id}>
                    <DisplayCard
                      image={image['deItemDetails']}
                      AssetType={image['deItemDetails']['AssetType']}
                      Id={image['deItemDetails']['Id']}
                      ItemType={image['deItemDetails']['ItemType']}
                      Owner={image['deItemDetails']['Owner']}
                      licenseIds={image['deItemDetails']['licenseIds']}
                      metaData={image['deItemDetails']['metaData']}
                    />
                  </div>
                );
              })}
          </div>
        </section>
      )}

      <NewItemForm
        isItemModalOpen={isItemModalOpen}
        setIsModalOpen={setIsItemModalOpen}
        createDeItem={createDeItem}
        setRefetch={setRefetch}
        refetch={refetch}
        // userDetails={userDetails}
      />
      <LicenceForm
        isLicenceModalOpen={isLicenceModalOpen}
        setIsLicenceModalOpen={setIsLicenceModalOpen}
        createLicence={createLicence}
        userDetails={userDetails}
        refetch={refetch}
        setRefetch={setRefetch}
      />
    </div>
  );
};

export default dashboard;
