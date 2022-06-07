import { useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, IconButton, Typography, CardContent } from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import cssStyles from '../../../../utils/cssStyles';
// @types
import { Gallery } from '../../../../@types/user';
// components
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
import LightboxModal from '../../../../components/LightboxModal';

// ----------------------------------------------------------------------

const CaptionStyle = styled(CardContent)(({ theme }) => ({
  ...cssStyles().bgBlur({ blur: 2, color: theme.palette.grey[900] }),
  bottom: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  justifyContent: 'space-between',
  color: theme.palette.common.white,
}));

// ----------------------------------------------------------------------

type Props = {
  gallery: Gallery[];
};

export default function ProfileGallery({ gallery }: Props) {
  const [openLightbox, setOpenLightbox] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number>(0);

  const imagesLightbox = gallery.map((img) => img.imageUrl);

  const handleOpenLightbox = (url: string) => {
    const selectedImage = imagesLightbox.findIndex((index) => index === url);
    setOpenLightbox(true);
    setSelectedImage(selectedImage);
  };
  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Gallery
      </Typography>

      <Card sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
          }}
        >
          {gallery.map((image) => (
            <GalleryItem key={image.id} image={image} onOpenLightbox={handleOpenLightbox} />
          ))}
        </Box>

        <LightboxModal
          images={imagesLightbox}
          mainSrc={imagesLightbox[selectedImage]}
          photoIndex={selectedImage}
          setPhotoIndex={setSelectedImage}
          isOpen={openLightbox}
          onCloseRequest={() => setOpenLightbox(false)}
        />
      </Card>
    </Box>
  );
}

// ----------------------------------------------------------------------

type GalleryItemProps = {
  image: Gallery;
  onOpenLightbox: (value: string) => void;
};

function GalleryItem({ image, onOpenLightbox }: GalleryItemProps) {
  const { imageUrl, title, postAt } = image;
  return (
    <Card sx={{ cursor: 'pointer', position: 'relative' }}>
      <Image
        alt="gallery image"
        ratio="1/1"
        src={imageUrl}
        onClick={() => onOpenLightbox(imageUrl)}
      />

      <CaptionStyle>
        <div>
          <Typography variant="subtitle1">{title}</Typography>
          <Typography variant="body2" sx={{ opacity: 0.72 }}>
            {fDate(postAt)}
          </Typography>
        </div>
        <IconButton color="inherit">
          <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
        </IconButton>
      </CaptionStyle>
    </Card>
  );
}
