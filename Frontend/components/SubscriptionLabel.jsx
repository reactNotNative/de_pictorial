import {
  createStyles,
  Group,
  Paper,
  Text,
  ThemeIcon,
  SimpleGrid,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { FaEthereum } from "react-icons/fa";
import { buyDeItem } from "../utilities/contractfunctions";
import { Button } from "@mantine/core";
import { toast } from "react-hot-toast";
import { utils } from "ethers";
const useStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing.xl * 1.5,
  },

  label: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}));

function SubscriptionLabel({ license, AssetType, Id }) {
  const [licenseState, setLicense] = useState({});

  const { classes } = useStyles();
  async function buy() {
    try {
      await buyDeItem(license["Id"], Id, AssetType, license["Price"]);
      toast.success(`Item bought`);
    } catch (err) {
      toast.error(`Error buying item ${err["reason"]} `);
    }
  }
  useEffect(() => {
    let licenseObj = {
      id: license["Id"],
      duration: license["Duration"],
      price: license["Price"],
      metaData: JSON.parse(license["metaData"]),
    };
    setLicense(licenseObj);
  }, []);
  useEffect(() => {
    console.log("licenseState:", licenseState);
  }, [licenseState]);

  const DiffIcon = FaEthereum;

  return (
    <div className="flex flex-wrap justify-start gap-4 grow">
      {" "}
      <Paper
        withBorder
        p="md"
        radius="md"
        key={licenseState.id}
        className="grow"
      >
        <Group position="apart">
          <div>
            <Text
              color="dimmed"
              weight={700}
              size="lg"
              className={classes.label}
            >
              {licenseState["metaData"] && licenseState["metaData"]["name"]}
              {" - "}
              <Text
                color="dimmed"
                weight={700}
                size="xs"
                className={classes.label}
              >
                {licenseState["metaData"] &&
                  licenseState["duration"] + " Days Left"}
              </Text>
            </Text>

            <Text weight={700} size="lg">
              {licenseState["price"] &&
                utils.formatEther(licenseState["price"])}{" "}
              MATIC
            </Text>
          </div>
          <div>
            <Text
              color="dimmed"
              weight={700}
              size="xs"
              className={classes.label}
            >
              {licenseState["Price"] && licenseState["Price"].toNumber()}
            </Text>
          </div>
          {AssetType != -1 && Id != -1 && (
            <Button
              onClick={() => buy()}
              size="md"
              className="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 flex"
              styles={{
                root: {
                  border: "none",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                },
              }}
            >
              {/* <ThemeIcon color="gray" variant="light" size={38} radius="md"> */}
              {/* <DiffIcon size={28} stroke={1.5} /> */}
              <svg viewBox="0 0 38.4 33.5" height={20} className="mr-2 text-white">
                <g>
                  <path fill='#FFF' d="M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3   c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7   c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7   c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1   L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7   c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z" />
                </g>
              </svg>
              {/* </ThemeIcon> */}
              <p>Buy</p>
            </Button>
          )}
        </Group>
      </Paper>
    </div>
  );
}

export default SubscriptionLabel;
