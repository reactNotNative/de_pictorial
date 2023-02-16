import FOG from "vanta/dist/vanta.fog.min.js";
import React, { useState, useEffect, useRef } from "react";
import { createStyles, Avatar, Text, Group } from "@mantine/core";
import { AiFillPhone, AiAt } from "react-icons/ai";
import NewItemForm from "../components/NewItemForm";
import LicenceForm from "../components/LicenceForm";
import Draggable from "../components/Draggable";
import DisplayCard from "./../components/DisplayCard";
import { Button } from "@mantine/core";
import {
  getContract,
  getAllLicences,
  getUserDetails,
  isUserRegistered,
  registerUser,
  createLicence,
  createDeItem,
} from "../utilities/contractfunctions";
import { isModalOpenAtom, userDataAtom } from "../store/global";
import { useAtom } from "jotai";
const dashboard = () => {
  const myRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isLicenceModalOpen, setIsLicenceModalOpen] = useState(false);
  // const [userData, setUserData] = useAtom(userDataAtom);

  const [userRegistered, setUserRegistered] = useState(false);
  const [userDetails, setUserDetails] = useAtom(userDataAtom);

  const useStyles = createStyles((theme) => ({
    draggable: {
      display: "flex",
      marginBottom: "16px",
      overflowX: "auto",
      gap: "20px",
      width: "100%",
      cursor: "pointer",
      padding: "8px 0",
    },
  }));
  const { classes } = useStyles();

  useEffect(() => {
    getContract();
    isUserRegistered().then((res) => {
      setUserRegistered(() => res);
      if (res) {
        console.log("in if");
        getUserDetails().then((res) => {
          console.log("res: ", res);
          setUserDetails(res);
        });
      } else {
        // registerUser();
      }
    });
  }, []);
  // console.log('userDetails: ', userDetails);
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
                  sx={{ textTransform: "uppercase" }}
                  weight={700}
                  color="dimmed"
                >
                  Username
                </Text>

                <Text size="xl" weight={500}>
                  Wallet Address{" "}
                </Text>
              </div>
            </Group>
          </div>
        </div>
      </section>
      <section className="container w-[95%] backdrop-blur-md bg-opacity-10 rounded-xl bg-white mx-auto p-5 inline-flex flex-col gap-10 items-start justify-center">
        <div className="inline-flex items-end justify-between w-full space-x-5">
          <p className="text-4xl font-bold leading-10">Uploaded Items</p>
          <Button
            onClick={() => setIsItemModalOpen(true)}
            size="md"
            className="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500"
            styles={{
              root: { border: "none" },
            }}
          >
            Upload
          </Button>
        </div>
        <div className="flex w-full gap-10 overflow-x-auto">
          <Draggable className={classes.draggable}>
            <>
              {[...Array(10)].map((image) => (
                <div className={classes.card}>
                  <DisplayCard image={image} />
                </div>
              ))}
            </>
          </Draggable>
        </div>
      </section>
      <section className="container w-[95%] backdrop-blur-md bg-opacity-10 rounded-t-xl bg-white mx-auto p-5 inline-flex flex-col gap-10 items-start justify-center">
        <div className="inline-flex items-end justify-between w-full space-x-5">
          <p className="text-4xl font-bold leading-10">Purchased Licenses</p>
          
        </div>
        <div className="flex w-full gap-10 overflow-x-auto">
          <Draggable className={classes.draggable}>
            <>
              {[...Array(10)].map((image) => (
                <div className={classes.card}>
                  <DisplayCard image={image} />
                </div>
              ))}
            </>
          </Draggable>
        </div>
      </section>

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
