import { m } from 'framer-motion';
// @mui
import { Link, Paper, Typography, CardActionArea } from '@mui/material';
// components
import Image from '../../components/Image';
import { varHover, varTranHover } from '../../components/animate';

// ----------------------------------------------------------------------

type Props = {
  item: {
    name: string;
    icon: string;
    href: string;
  };
};

export default function ComponentCard({ item }: Props) {
  const { name, icon, href } = item;

  return (
    <Link href={href} underline="none" target="_blank" rel="noopener">
      <Paper variant="outlined" sx={{ p: 1 }}>
        <CardActionArea
          component={m.div}
          whileHover="hover"
          sx={{
            p: 3,
            borderRadius: 1,
            color: 'primary.main',
            bgcolor: 'background.neutral',
          }}
        >
          <m.div variants={varHover(1.2)} transition={varTranHover()}>
            <Image src={icon} alt={name} effect="black-and-white" />
          </m.div>
        </CardActionArea>

        <Typography variant="subtitle2" sx={{ mt: 1, p: 1 }}>
          {name}
        </Typography>
      </Paper>
    </Link>
  );
}
