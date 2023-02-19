import {
  createStyles,
  Group,
  Paper,
  Text,
  ThemeIcon,
  SimpleGrid,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { FaEthereum } from 'react-icons/fa';
import { buyDeItem } from '../utilities/contractfunctions';
import { Button } from '@mantine/core';
import { toast } from 'react-hot-toast';
import { utils } from 'ethers';
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
      await buyDeItem(license['Id'], Id, AssetType, license['Price']);
      toast.success(`Item bought`);
    } catch (err) {
      toast.error(`Error buying item ${err['reason']} `);
    }
  }
  useEffect(() => {
    let licenseObj = {
      id: license['Id'],
      duration: license['Duration'],
      price: license['Price'],
      metaData: JSON.parse(license['metaData']),
    };
    setLicense(licenseObj);
  }, []);
  useEffect(() => {
    console.log('licenseState:', licenseState);
  }, [licenseState]);

  const DiffIcon = FaEthereum;

  return (
    <div className="flex flex-wrap justify-start gap-4">
      {' '}
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
              size="xs"
              className={classes.label}
            >
              {licenseState['metaData'] && licenseState['metaData']['name']}
              {' - '}
              {licenseState['metaData'] &&
                licenseState['duration'] + ' Days Left'}
            </Text>
            <Text weight={700} size="lg">
              {licenseState['price'] &&
                utils.formatEther(licenseState['price'])}{' '}
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
              {licenseState['Price'] && licenseState['Price'].toNumber()}
            </Text>
          </div>
          {AssetType != -1 && Id != -1 && (
            <Button
              onClick={() => buy()}
              size="md"
              className="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500"
              styles={{
                root: { border: 'none' },
              }}
            >
              <ThemeIcon color="gray" variant="light" size={38} radius="md">
                <DiffIcon size={28} stroke={1.5} />
              </ThemeIcon>
              Buy
            </Button>
          )}
        </Group>
      </Paper>
    </div>
  );
}

export default SubscriptionLabel;
