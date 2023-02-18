import {
  Button,
  Modal,
  NumberInput,
  Radio,
  SegmentedControl,
  Switch,
  TextInput,
  Textarea,
  LoadingOverlay,
} from '@mantine/core';
import React, { useState } from 'react';
import { NFTStorage } from 'nft.storage';

const LicenceForm = ({
  isLicenceModalOpen,
  setIsLicenceModalOpen,
  createLicence,
  userDetails,
}) => {
  const [formData, setFormData] = useState({
    title: null,
    duration: 12,
    description: '',
    price: 0,
    licenceType: 'Paid',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  async function handelSubmit(e) {
    if (formData.licenceType === 'Free') {
      formData.price = 0;
    }
    e.preventDefault();
    setLoading(true);
    try {
      // defaultToast('Uploading Image...');

      const client = new NFTStorage({
        token: process.env.NEXT_PUBLIC_NFT_STORAGE,
      });

      const metadata = JSON.stringify({
        name: formData.title,
        description: formData.description,
        licenceType: formData.licenceType,
        duration: formData.duration,
      });

      deLicence(metadata, formData);
    } catch (err) {
      setLoading(false);
      setError(err);
      toast.error('Error Creating Licence');
    }
  }

  async function deLicence(metadata, formData) {
    try {
      await createLicence(formData.price, formData.duration, metadata);
      setLoading(false);
      setIsLicenceModalOpen(false);
    } catch (err) {
      console.log(err['error']['data']['message']);
      toast.error('Failed to create licence. Please try again later.');

      setLoading(false);
      setError(err['error']['data']['message']);
    }
  }
  return (
    <Modal
      onClose={() => {
        setIsLicenceModalOpen(false);
      }}
      opened={isLicenceModalOpen}
      title="Add Licence"
      withCloseButton={true}
      closeOnClickOutside={true}
      closeOnEscape={true}
      centered
      overflow="inside"
      size="lg"
      transition="scale"
    >
      <LoadingOverlay visible={loading} />

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
        {error && <p className="text-red-500">{error}</p>}
        <Button onClick={handelSubmit}>SUBMIT</Button>
      </div>
    </Modal>
  );
};

export default LicenceForm;
