import { ReactNode } from 'react';
import { Container, Alert, AlertTitle } from '@mui/material';

// ----------------------------------------------------------------------

type RoleBasedGuardProp = {
  accessibleRoles: string[];
  children: ReactNode | string;
};

const useCurrentRole = () => {
  // Logic here to get current user role
  const role = 'admin';
  return role;
};

export default function RoleBasedGuard({ accessibleRoles, children }: RoleBasedGuardProp) {
  const currentRole = useCurrentRole();

  if (!accessibleRoles.includes(currentRole)) {
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>Permission Denied</AlertTitle>
          You do not have permission to access this page
        </Alert>
      </Container>
    );
  }

  return <>{children}</>;
}
