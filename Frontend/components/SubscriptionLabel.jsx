import {
  createStyles,
  Group,
  Paper,
  Text,
  ThemeIcon,
  SimpleGrid,
} from "@mantine/core";
import { FaEthereum } from "react-icons/fa";

const useStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing.xl * 1.5,
  },

  label: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}));

function SubscriptionLabel() {
  const data = [
    {
      title: "1yrs License",
      value: "2 MAT",
      diff: 34,
    },
    {
      title: "Profit",
      value: "$4,145",
      diff: -13,
    },
    {
      title: "Coupons usage",
      value: "745",
      diff: 18,
    },
  ];

  const { classes } = useStyles();
  const stats = data.map((stat) => {
    const DiffIcon = FaEthereum;

    return (
      <Paper withBorder p="md" radius="md" key={stat.title} className="grow">
        <Group position="apart">
          <div>
            <Text
              color="dimmed"
              weight={700}
              size="xs"
              className={classes.label}
            >
              {stat.title}
            </Text>
            <Text weight={700} size="lg">
              {stat.value}
            </Text>
          </div>
          <ThemeIcon color="gray" variant="light" size={38} radius="md">
            <DiffIcon size={28} stroke={1.5} />
          </ThemeIcon>
        </Group>
      </Paper>
    );
  });

  return (
    <div className="flex flex-wrap justify-start gap-4">
      {stats}
    </div>
  );
}

export default SubscriptionLabel;
