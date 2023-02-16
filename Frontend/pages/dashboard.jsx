import FOG from 'vanta/dist/vanta.fog.min.js';
import React, { useState, useEffect, useRef } from 'react';
import { createStyles, Avatar, Text, Group } from '@mantine/core';
import { AiFillPhone, AiAt } from 'react-icons/ai';
import NewItemForm from '../components/NewItemForm';
import { NFTStorage } from 'nft.storage';

import {
  getContract,
  getAllLicences,
  getUserDetails,
  isUserRegistered,
  registerUser,
  createLicence,
  createDeItem,
} from '../utilities/contractfunctions';
import { isModalOpenAtom, userDataAtom } from '../store/global';
import { useAtom } from 'jotai';
const dashboard = () => {
  const myRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isLicenceModalOpen, setIsLicenceModalOpen] = useState(false);
  const [userData, setUserData] = useAtom(userDataAtom);

  const [userRegistered, setUserRegistered] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const data = {
    avatar:
      'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    title: 'Software engineer',
    name: 'Robert Glassbreaker',
    email: 'robert@glassbreaker.io',
    phone: '+11 (876) 890 56 23',
  };

  useEffect(() => {
    getContract();
    isUserRegistered().then((res) => {
      setUserRegistered(() => res);
      if (res) {
        getUserDetails().then((res) => {
          // console.log("res: ", res);
          setUserDetails(() => res);
        });
      } else {
        // registerUser();
      }
    });
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
        <div className="flex">
          <div>
            <Group noWrap>
              <Avatar src={data.avatar} size={94} radius="md" />
              <div>
                <Text
                  size="xs"
                  sx={{ textTransform: 'uppercase' }}
                  weight={700}
                  color="dimmed"
                >
                  {data.title}
                </Text>

                <Text size="lg" weight={500}>
                  {data.name}
                </Text>

                <Group noWrap spacing={10} mt={3}>
                  {/* <AiAt stroke={1.5} size={16}  /> */}
                  <Text size="xs" color="dimmed">
                    {data.email}
                  </Text>
                </Group>

                <Group noWrap spacing={10} mt={5}>
                  <AiFillPhone stroke={1.5} size={16} />
                  <Text size="xs" color="dimmed">
                    {data.phone}
                  </Text>
                </Group>
              </div>
            </Group>
          </div>
        </div>
        <button onClick={() => setIsItemModalOpen(true)}>Upload DeItem</button>
      </section>

      {isItemModalOpen && <NewItemForm setIsModalOpen={setIsItemModalOpen} />}
    </div>
  );
};

export default dashboard;
