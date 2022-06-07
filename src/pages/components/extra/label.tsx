import { ReactNode } from 'react';
// @mui
import { styled, alpha, Theme } from '@mui/material/styles';
import { Box, Container, Stack, Paper, CardHeader, SxProps } from '@mui/material';
// routes
import { PATH_PAGE } from '../../../routes/paths';
// layouts
import Layout from '../../../layouts';
// components
import Page from '../../../components/Page';
import Label from '../../../components/Label';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(11),
  paddingBottom: theme.spacing(15),
}));

// ----------------------------------------------------------------------

DemoLabel.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="main">{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function DemoLabel() {
  return (
    <Page title="Components: Label">
      <RootStyle>
        <Box
          sx={{
            pt: 6,
            pb: 1,
            mb: 10,
            bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800'),
          }}
        >
          <Container>
            <HeaderBreadcrumbs
              heading="Label"
              links={[{ name: 'Components', href: PATH_PAGE.components }, { name: 'Label' }]}
            />
          </Container>
        </Box>

        <Container>
          <Stack spacing={3}>
            <Block title="Filled">
              <Label variant="filled"> Default</Label>
              <Label variant="filled" color="primary">
                Primary
              </Label>
              <Label variant="filled" color="secondary">
                Secondary
              </Label>
              <Label variant="filled" color="info">
                Info
              </Label>
              <Label variant="filled" color="success">
                Success
              </Label>
              <Label variant="filled" color="warning">
                Waring
              </Label>
              <Label variant="filled" color="error">
                Error
              </Label>
            </Block>

            <Block title="Outlined">
              <Label variant="outlined"> Default</Label>
              <Label variant="outlined" color="primary">
                Primary
              </Label>
              <Label variant="outlined" color="secondary">
                Secondary
              </Label>
              <Label variant="outlined" color="info">
                Info
              </Label>
              <Label variant="outlined" color="success">
                Success
              </Label>
              <Label variant="outlined" color="warning">
                Waring
              </Label>
              <Label variant="outlined" color="error">
                Error
              </Label>
            </Block>

            <Block title="Ghost">
              <Label> Default</Label>
              <Label color="primary">Primary</Label>
              <Label color="secondary">Secondary</Label>
              <Label color="info">Info</Label>
              <Label color="success">Success</Label>
              <Label color="warning">Waring</Label>
              <Label color="error">Error</Label>
            </Block>
          </Stack>
        </Container>
      </RootStyle>
    </Page>
  );
}

// ----------------------------------------------------------------------

type BlockProps = {
  title?: string;
  children: ReactNode;
  sx?: SxProps<Theme>;
};

export function Block({ title, children }: BlockProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 1.5,
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
      }}
    >
      {title && <CardHeader title={title} />}
      <Box
        sx={{
          p: 5,
          minHeight: 180,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          '& > *': { mx: 1 },
        }}
      >
        {children}
      </Box>
    </Paper>
  );
}
