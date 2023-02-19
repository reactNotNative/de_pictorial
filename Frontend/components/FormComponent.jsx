import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  FormLabel,
  FormControl,
  Input,
  Button,
  Radio,
  RadioGroup,
  Stack,
  Tooltip,
} from "@chakra-ui/react";
// import {Inp}
// import { InfoOutlineIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { pascalStrToSpacedWord } from "./helper";
import { Select } from "@mantine/core";

function FormComponent({ fieldInfo, passBackResults, LicenseData = false }) {
  const [canSubmitForm, setCanSubmitForm] = useState(false);
  const [value, setValue] = useState(null);

  const {
    handleSubmit,
    register,
    getValues,
    control,
    formState: { errors, isSubmitting },
  } = useForm();
  console.log("Asd", LicenseData);
  const licData = LicenseData.map((licence) => {
    let temp = JSON.parse(licence.metaData);
    return { label: temp.name, value: licence.Id.toNumber() };
  });

  const FormInfoLabel = ({ name, info }) => {
    const spacedName = pascalStrToSpacedWord(name);
    return <FormLabel htmlFor={name}>{spacedName} </FormLabel>;
  };

  return (
    <form
      onSubmit={handleSubmit(passBackResults)}
      onChange={() => {
        const resultsAreValid = Object.values(getValues()).every(
          (i) => typeof i === "string" && i.length > 0
        );
        setCanSubmitForm(resultsAreValid);
      }}
    >
      <FormControl>
        {fieldInfo.map((field) => {
          const { name, type, description } = field;
          return (
            <Box key={name} m={4}>
              <FormInfoLabel name={name} info={description} />

              {type === "date" && (
                <Input
                  id={name}
                  type="date"
                  {...register(name, {
                    required: "This is required",
                  })}
                />
              )}

              {type === "number" && (
                // <Select
                //   id={name}
                //   label="Your favorite framework/library"
                //   placeholder="Pick one"
                //   data={licData}
                //   value={value}
                //   onChange={setValue}
                //   name={value}
                //   type="number"
                //   {...register(name, {
                //     required: "This is required",
                //     setValueAs: (v) => value,
                //   })}
                // />
                // <Controller
                //   name={name}
                //   control={control}
                //   rules={{ required: "This is required" }}
                //   render={({ field: { onChange, value } }) => (
                //     <Select
                //       id={name}
                //       placeholder="Select one"
                //       data={licData}
                //       value={value}
                //       onChange={onChange}
                //     />
                //   )}
                // />
                <select
                  id={name}
                  type="number"
                  placeholder={"asdsab"}
                  {...register(name, {
                    required: "This is required",
                  })}
                  className="w-full p-4"
                >
                  {licData.map((lic) => (
                    <option value={lic.value}>{lic.label}</option>
                  ))}
                </select>
              )}
              {type === "boolean" && (
                <Controller
                  name={name}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <RadioGroup onChange={onChange} value={value}>
                      <Stack direction="row">
                        <Radio value="1">Yes</Radio>
                        <Radio value="0">No</Radio>
                      </Stack>
                    </RadioGroup>
                  )}
                />
              )}
            </Box>
          );
        })}
      </FormControl>
      <Box key={name} m={4}>
        <Button
          w="100%"
          mt={4}
          colorScheme="teal"
          isLoading={isSubmitting}
          type="submit"
          disabled={!canSubmitForm}
        >
          Claim
        </Button>
      </Box>
    </form>
  );
}

export default FormComponent;
