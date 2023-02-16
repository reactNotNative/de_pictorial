import {
  Input,
  LoadingOverlay,
  Modal,
  MultiSelect,
  SegmentedControl,
  Select,
  TextInput,
  Textarea,
  useMantineTheme,
  Button,
} from '@mantine/core';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import React, { useEffect, useState } from 'react';
import { NFTStorage } from 'nft.storage';
import { ToastContainer } from 'react-toastify';
import { isModalOpenAtom, userDataAtom } from '../store/global';
import { useAtom } from 'jotai';
const NewItemForm = ({ isItemModalOpen, setIsModalOpen, createDeItem }) => {
  const [userDetails, setUserDetails] = useAtom(userDataAtom);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    collection: false,
    mediaType: '',
    tags: [],
    licences: [],
    files: null,
  });
  const [loading, setLoading] = useState(false);
  const [userLicences, setUserLicences] = useState([]);
  useEffect(() => {
    console.log('LICENCES: ', userDetails);
    if (userDetails == null) return;
    userDetails?.licenseDetails?.map((licence) => {
      console.log('LICENCE: ', licence);
      let licenceObj = JSON.parse(licence.metaData);
      console.log('LICENCE OBJ: ', licenceObj);
      setUserLicences((userLicences) => [
        ...userLicences,
        {
          value: licence.Id.toNumber(),
          label: licenceObj.name,
          // price: licence.price,
        },
      ]);
    });
    // setUserLicences();
  }, [userDetails]);

  console.log(formData);
  const theme = useMantineTheme();
  async function handelSubmit(e) {
    // defaultToast('Creating DeItem...');
    e.preventDefault();
    setLoading(true);
    // console.log('ON SUBMIT:', formData);

    try {
      // defaultToast('Uploading Image...');

      const client = new NFTStorage({
        token: process.env.NEXT_PUBLIC_NFT_STORAGE,
      });
      console.log('client: ', client);
      console.log('IN TRY: ', formData.files);
      // const imageFile = new File([ someBinaryImageData ], 'nft.png', { type: 'image/png' })
      // let urls = [];
      let urls = formData.files.map((file) => {
        return client.store({
          name: formData.title,
          description: formData.description,
          tags: formData.tags,
          mediaType: formData.mediaType,
          collection: formData.collection,
          image: file,
        });

        // urls.push(metadata.url);
        // console.log('METADATA: ', metadata);
        // console.log(metadata);
        // update formData with the url
        // setFormData({ ...formData, files: urls });
      });
      urls = await Promise.all(urls);

      console.log('URLS: ', urls[0]);
      deItem(urls, formData);
    } catch (err) {
      // error("Error Uploading Cover Image");
      console.log(err);
    }
  }
  async function deItem(urls, formData) {
    // defaultToast('Uploading Smart Contract...');
    console.log('IN CREATE DEITEM');
    console.log('URLS:', urls);
    console.log('FORMDATA:', formData);
    let media = {
      Photo: 0,
      Video: 1,
      Audio: 2,
      Meme: 3,
    };
    console.log(
      'OUPUT',
      formData.collection ? 1 : 0,
      media[formData.mediaType],
      formData.licences,
      urls[0].url
    );
    await createDeItem(
      formData.collection ? 1 : 0,
      media[formData.mediaType],
      formData.licences,
      urls[0].url
    );
    console.log('SMART CONTRACT DONE');
    setLoading(false);
  }
  return (
    <>
      <Modal
        onClose={() => {
          setIsModalOpen(false);
        }}
        opened={isItemModalOpen}
        title="Add New Media"
        withCloseButton={true}
        closeOnClickOutside={true}
        closeOnEscape={true}
        centered
        overflow="outside"
        size="lg"
        transition="scale"
      >
        <LoadingOverlay visible={loading} />
        <div className="flex flex-col gap-5">
          <SegmentedControl
            value={formData.collection}
            styles={{
              active: {
                background:
                  'linear-gradient(to right, rgb(251, 113, 133), rgb(217, 70, 239), rgb(99, 102, 241))',
              },
            }}
            transitionDuration={500}
            transitionTimingFunction="linear"
            onChange={(val) => setFormData({ ...formData, collection: val })}
            data={[
              { label: 'Single', value: false },
              { label: 'Collection', value: true },
            ]}
          />
          <div
            className={`inline-block mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-500'
            }`}
          >
            File Upload
          </div>
          <Dropzone
            onDrop={(files) => {
              console.log('accepted files', files);
              setFormData({ ...formData, files: files });
            }}
            onReject={(files) => console.log('rejected files', files)}
            maxFiles={formData.collection ? 5 : 1}
            multiple={formData.collection}
            accept={IMAGE_MIME_TYPE}
          >
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
                </div>
              </div>
            </div>
          </Dropzone>
          <TextInput
            label="Title"
            placeholder="Enter Title"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
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
              onChange={(val) => setFormData({ ...formData, mediaType: val })}
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
          {/* {console.log('USRE LICENCES:', userLicences)} */}
          <MultiSelect
            disabled={false}
            placeholder="Select Licences"
            label="Licences"
            value={formData.licences}
            data={userLicences}
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
          <Button onClick={handelSubmit}>SUBMIT</Button>
        </div>
      </Modal>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default NewItemForm;
