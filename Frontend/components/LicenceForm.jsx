import {
  Modal,
  NumberInput,
  Radio,
  SegmentedControl,
  Switch,
  TextInput,
  Textarea,
} from '@mantine/core';
import React, { useState } from 'react';

const LicenceForm = () => {
  const [formData, setFormData] = useState({
    title: null,
    duration: 12,
    description: null,
    licenceType: 'Paid',
  });
  return (
    <Modal
      onClose={() => {
        // setIsModalOpen(false);
      }}
      opened={false}
      title="Add Licence"
      withCloseButton={true}
      closeOnClickOutside={true}
      closeOnEscape={true}
      centered
      overflow="inside"
      size="lg"
      transition="scale"
    >
      {/* <LoadingOverlay visible={true} /> */}
      <div className="flex flex-col gap-5">
        <TextInput
          styles={{
            input: {
              '&:focus': {
                borderColor: 'pink',
              },
              '&:focus-within': {
                borderColor: 'pink',
              },
            },
          }}
          label="Title"
          placeholder="Enter Title"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <div className="flex w-full grow">
          <Radio.Group
            styles={{
              radio: {
                background:
                  'linear-gradient(to right, rgb(251, 113, 133), rgb(217, 70, 239), rgb(99, 102, 241))',
              },
            }}
            className="w-1/3 ml-auto"
            value={formData.licenceType}
            onChange={(val) => setFormData({ ...formData, licenceType: val })}
            name="licenceType"
            label="Select type of licence"
          >
            <Radio
              styles={{
                radio: {
                  '&:checked': {
                    background:
                      'linear-gradient(to right, rgb(251, 113, 133), rgb(217, 70, 239), rgb(99, 102, 241))',
                  },
                },
              }}
              value="Free"
              label="Free"
            />
            <Radio
              styles={{
                radio: {
                  '&:checked': {
                    background:
                      'linear-gradient(to right, rgb(251, 113, 133), rgb(217, 70, 239), rgb(99, 102, 241))',
                  },
                },
              }}
              value="Paid"
              label="Paid"
            />
          </Radio.Group>
          <NumberInput
            styles={{
              input: {
                '&:focus': {
                  borderColor: 'pink',
                },
                '&:focus-within': {
                  borderColor: 'pink',
                },
              },
            }}
            className="w-2/3"
            defaultValue={12}
            value={formData.duration}
            onChange={(val) => setFormData({ ...formData, duration: val })}
            placeholder="Duration in months"
            label="Duration (Months)"
          />
        </div>
        <NumberInput
          styles={{
            input: {
              '&:focus': {
                borderColor: 'pink',
              },
              '&:focus-within': {
                borderColor: 'pink',
              },
            },
          }}
          disabled={formData.licenceType === 'Free'}
          value={formData.price}
          onChange={(val) => setFormData({ ...formData, price: val })}
          placeholder="Price in USD"
          label="Price of Licence"
        />
        <Textarea
          label="Description"
          styles={{
            input: {
              '&:focus': {
                borderColor: 'pink',
              },
              '&:focus-within': {
                borderColor: 'pink',
              },
            },
          }}
          placeholder="Enter Description"
          value={formData.description}
          minRows={5}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>
    </Modal>
  );
};

export default LicenceForm;
