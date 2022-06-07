import { m } from 'framer-motion';
// @mui
import { Typography, Box, Paper } from '@mui/material';
// components
import Image from '../../components/Image';
import { MotionViewport, varFade } from '../../components/animate';

// ----------------------------------------------------------------------

const CATEGORIES = [
  {
    label: 'Managing your account',
    icon: 'https://minimal-assets-api.vercel.app/assets/icons/faqs/ic_account.svg',
    href: '#',
  },
  {
    label: 'Payment',
    icon: 'https://minimal-assets-api.vercel.app/assets/icons/faqs/ic_payment.svg',
    href: '#',
  },
  {
    label: 'Delivery',
    icon: 'https://minimal-assets-api.vercel.app/assets/icons/faqs/ic_delivery.svg',
    href: '#',
  },
  {
    label: 'Problem with the Product',
    icon: 'https://minimal-assets-api.vercel.app/assets/icons/faqs/ic_package.svg',
    href: '#',
  },
  {
    label: 'Return & Refund',
    icon: 'https://minimal-assets-api.vercel.app/assets/icons/faqs/ic_refund.svg',
    href: '#',
  },
  {
    label: 'Guarantees and assurances',
    icon: 'https://minimal-assets-api.vercel.app/assets/icons/faqs/ic_assurances.svg',
    href: '#',
  },
];

// ----------------------------------------------------------------------

export default function FaqsCategory() {
  return (
    <Box
      component={MotionViewport}
      sx={{
        mb: 15,
        display: 'grid',
        gap: 3,
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(6, 1fr)',
        },
      }}
    >
      {CATEGORIES.map((category) => (
        <m.div key={category.label} variants={varFade().in}>
          <CategoryCard category={category} />
        </m.div>
      ))}
    </Box>
  );
}

// ----------------------------------------------------------------------

type CategoryCardProps = {
  category: {
    label: string;
    icon: string;
  };
};

function CategoryCard({ category }: CategoryCardProps) {
  const { label, icon } = category;

  return (
    <Paper
      variant="outlined"
      sx={{
        px: 2,
        height: 260,
        borderRadius: 2,
        display: 'flex',
        textAlign: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        '&:hover': {
          boxShadow: (theme) => theme.customShadows.z24,
        },
      }}
    >
      <Image
        alt={icon}
        visibleByDefault
        disabledEffect
        src={icon}
        sx={{ mb: 2, width: 80, height: 80 }}
      />
      <Typography variant="subtitle2">{label}</Typography>
    </Paper>
  );
}
