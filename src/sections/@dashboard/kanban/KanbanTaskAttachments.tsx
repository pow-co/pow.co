import isString from 'lodash/isString';
import { useDropzone } from 'react-dropzone';
import { useState, useCallback } from 'react';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, IconButton } from '@mui/material';
// components
import Image from '../../../components/Image';
import Iconify from '../../../components/Iconify';
import LightboxModal from '../../../components/LightboxModal';
import { varFade } from '../../../components/animate';

// ----------------------------------------------------------------------

const DropZoneStyle = styled('div')(({ theme }) => ({
  width: 64,
  height: 64,
  fontSize: 24,
  display: 'flex',
  cursor: 'pointer',
  alignItems: 'center',
  justifyContent: 'center',
  margin: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  border: `dashed 1px ${theme.palette.divider}`,
  '&:hover': { opacity: 0.72 },
}));

// ----------------------------------------------------------------------

type Props = {
  attachments: string[];
};

export default function KanbanTaskAttachments({ attachments }: Props) {
  const [openLightbox, setOpenLightbox] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number>(0);

  const imagesLightbox = attachments;

  const handleOpenLightbox = (url: string) => {
    const selectedImage = imagesLightbox.findIndex((index) => index === url);
    setOpenLightbox(true);
    setSelectedImage(selectedImage);
  };

  return (
    <>
      {attachments.map((attachment) => (
        <Image
          key={attachment}
          alt={attachment}
          src={attachment}
          onClick={() => handleOpenLightbox(attachment)}
          sx={{
            m: 0.5,
            width: 64,
            height: 64,
            borderRadius: 1,
            cursor: 'pointer',
          }}
        />
      ))}

      <UploadFile />

      <LightboxModal
        images={imagesLightbox}
        mainSrc={imagesLightbox[selectedImage]}
        photoIndex={selectedImage}
        setPhotoIndex={setSelectedImage}
        isOpen={openLightbox}
        onCloseRequest={() => setOpenLightbox(false)}
      />
    </>
  );
}

// ----------------------------------------------------------------------

function UploadFile() {
  const [files, setFiles] = useState([]);

  const handleRemove = (file: File) => {
    const filteredItems = files.filter((_file) => _file !== file);
    setFiles(filteredItems);
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file: File) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
  });

  return (
    <>
      {files.map((file) => {
        const { name, preview } = file;
        const key = isString(file) ? file : name;

        return (
          <Box
            key={key}
            {...varFade().inRight}
            sx={{
              p: 0,
              m: 0.5,
              width: 64,
              height: 64,
              borderRadius: 1,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Image
              alt="preview"
              src={isString(file) ? file : preview}
              sx={{
                height: 1,
                position: 'absolute',
                border: (theme) => `solid 1px ${theme.palette.divider}`,
              }}
            />
            <Box sx={{ top: 6, right: 6, position: 'absolute' }}>
              <IconButton
                size="small"
                onClick={() => handleRemove(file)}
                sx={{
                  p: '2px',
                  color: 'common.white',
                  bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                  },
                }}
              >
                <Iconify icon={'eva:close-fill'} />
              </IconButton>
            </Box>
          </Box>
        );
      })}

      <DropZoneStyle
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
        }}
      >
        <input {...getInputProps()} />

        <Iconify icon={'eva:plus-fill'} sx={{ color: 'text.secondary' }} />
      </DropZoneStyle>
    </>
  );
}
