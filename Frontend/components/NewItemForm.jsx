import {
  Input,
  LoadingOverlay,
  Modal,
  MultiSelect,
  Select,
  TextInput,
  Textarea,
  useMantineTheme,
} from '@mantine/core';
import React, { useState } from 'react';

const NewItemForm = () => {
  const [formData, setFormData] = useState({
    tags: [],
  });
  const theme = useMantineTheme();

  console.log(formData);
  return (
    <Modal
      onClose={() => {
        // setIsModalOpen(false);
      }}
      opened={true}
      title="Add New Media"
      withCloseButton={true}
      closeOnClickOutside={true}
      closeOnEscape={true}
      styles={{
        label: {
          color: 'green',
          marginBottom: '5px',
        },
        modal: {
          // padding: '0px !important',
          // borderRadius: '8px',
          // overflow: 'hidden',
          // margin: '0px',
        },
      }}
      centered
      overflow="outside"
      size="lg"
      transition="scale"
    >
      {/* <LoadingOverlay visible={true} /> */}
      <div className="flex flex-col gap-5">
        <div
          className={`inline-block mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-500'
          }`}
        >
          File Upload
        </div>

        {/* title and desc div  */}
        <div className="flex items-center justify-center w-full group">
          <div
            className={`flex flex-col relative w-full h-32 border-2 border-blue-200 border-dashed 
            ${
              theme === 'dark'
                ? 'group-hover:bg-gray-500 group-hover:border-gray-200'
                : 'group-hover:bg-gray-100 group-hover:border-gray-300'
            }
            
            `}
          >
            <div className="flex flex-col items-center justify-center pt-7">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span
                className={`pt-1 text-sm tracking-wider ${
                  theme === 'dark' ? 'text-white' : 'text-gray-400'
                } `}
              >
                Attach a file
              </span>
              <input
                className="opacity-0 z-50 absolute w-[230px] md:w-[282px] h-full top-[.5px] "
                name="image"
                onChange={(e) => handleImageChange(e)}
                type="file"
              />
            </div>
          </div>
        </div>
        <TextInput
          label="Title"
          placeholder="Enter Title"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <div className="flex gap-4">
          <Select
            label="Select Type Of Media"
            placeholder="Pick one"
            className="flex-1"
            data={[
              { value: 'Photo', label: 'Photo' },
              { value: 'Video', label: 'Video' },
              { value: 'Meme', label: 'Meme' },
              { value: 'Audio', label: 'Audio' },
            ]}
          />
          <MultiSelect
            label="Tags"
            data={formData.tags}
            value={formData.tags}
            className="flex-1"
            styles={{
              wrapper: {
                '&:hover': { borderColor: 'white' },
                '&:focus': { borderColor: 'white' },
                '&:active': { borderColor: 'white' },
              },
              input: {
                '&:hover': { borderColor: 'white' },
                '&:focus': { borderColor: 'white' },
              },
            }}
            onChange={(val) => setFormData({ ...formData, tags: val })}
            placeholder="Create Tags"
            maxSelectedValues={3}
            searchable
            creatable
            clearable
            getCreateLabel={(query) => `+ Create #${query}`}
            onCreate={(query) =>
              setFormData({
                ...formData,
                tags: [...formData.tags, `#${query}`],
              })
            }
          />
        </div>

        <MultiSelect
          disabled={false}
          placeholder="Select Licences"
          label="Licences"
          value={formData.licences}
          data={[
            {
              value: '0',
              label: 'Free Licence',
            },
            {
              value: '1',
              label: 'Standard Licence',
            },
            {
              value: '2',
              label: 'Premium Licence',
            },
            {
              value: '3',
              label: 'Exclusive Licence',
            },
          ]}
          onChange={(val) => setFormData({ ...formData, licences: val })}
          clearable
          searchable
          nothingFound="No User Found"
        />
        <Textarea
          label="Description"
          placeholder="Media Description"
          autosize
          minRows={2}
          maxRows={3}
          value={formData.description}
          onChange={(event) =>
            setFormData({ ...formData, description: event.target.value })
          }
        />
      </div>
    </Modal>
  );
};

export default NewItemForm;
