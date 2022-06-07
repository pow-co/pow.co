import { createContext, ReactNode, useCallback, useEffect, useReducer } from 'react';
import {
  CognitoUser,
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUserSession,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
// utils
import axios from '../utils/axios';
// routes
import { PATH_AUTH } from '../routes/paths';
// @types
import { ActionMap, AuthState, AuthUser, AWSCognitoContextType } from '../@types/auth';
//
import { COGNITO_API } from '../config';

// ----------------------------------------------------------------------

// CAUTION: User Cognito is slily difference from firebase, so be sure to read the doc carefully.

export const UserPool = new CognitoUserPool({
  UserPoolId: COGNITO_API.userPoolId || '',
  ClientId: COGNITO_API.clientId || '',
});

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

enum Types {
  auth = 'AUTHENTICATE',
  logout = 'LOGOUT',
}

type AwsAuthPayload = {
  [Types.auth]: {
    isAuthenticated: boolean;
    user: AuthUser;
  };
  [Types.logout]: undefined;
};

type AwsActions = ActionMap<AwsAuthPayload>[keyof ActionMap<AwsAuthPayload>];

const reducer = (state: AuthState, action: AwsActions) => {
  if (action.type === 'AUTHENTICATE') {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }
  return state;
};

const AuthContext = createContext<AWSCognitoContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getUserAttributes = useCallback(
    (currentUser: CognitoUser): Record<string, any> =>
      new Promise((resolve, reject) => {
        currentUser.getUserAttributes((err, attributes) => {
          if (err) {
            reject(err);
          } else {
            const results: Record<string, any> = {};

            attributes?.forEach((attribute) => {
              results[attribute.Name] = attribute.Value;
            });
            resolve(results);
          }
        });
      }),
    []
  );

  const getSession = useCallback(
    () =>
      new Promise((resolve, reject) => {
        const user = UserPool.getCurrentUser();
        if (user) {
          user.getSession(async (err: Error | null, session: CognitoUserSession | null) => {
            if (err) {
              reject(err);
            } else {
              const attributes = await getUserAttributes(user);
              const token = session?.getIdToken().getJwtToken();
              // use the token or Bearer depend on the wait BE handle, by default amplify API only need to token.
              axios.defaults.headers.common.Authorization = token as string;
              dispatch({
                type: Types.auth,
                payload: { isAuthenticated: true, user: attributes },
              });
              resolve({
                user,
                session,
                headers: { Authorization: token },
              });
            }
          });
        } else {
          dispatch({
            type: Types.auth,
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      }),
    [getUserAttributes]
  );

  const initial = useCallback(async () => {
    try {
      await getSession();
    } catch {
      dispatch({
        type: Types.auth,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, [getSession]);

  useEffect(() => {
    initial();
  }, [initial]);

  // We make sure to handle the user update here, but return the resolve value in order for our components to be
  // able to chain additional `.then()` logic. Additionally, we `.catch` the error and "enhance it" by providing
  // a message that our React components can use.
  const login = useCallback(
    (email, password) =>
      new Promise((resolve, reject) => {
        const user = new CognitoUser({
          Username: email,
          Pool: UserPool,
        });

        const authDetails = new AuthenticationDetails({
          Username: email,
          Password: password,
        });

        user.authenticateUser(authDetails, {
          onSuccess: (data) => {
            getSession();
            resolve(data);
          },
          onFailure: (err) => {
            reject(err);
          },
          newPasswordRequired: () => {
            // Handle this on login page for update password.
            resolve({ message: 'newPasswordRequired' });
          },
        });
      }),
    [getSession]
  );

  // same thing here
  const logout = () => {
    const user = UserPool.getCurrentUser();
    if (user) {
      user.signOut();
      dispatch({ type: Types.logout });
    }
  };

  const register = (email: string, password: string, firstName: string, lastName: string) =>
    new Promise((resolve, reject) => {
      UserPool.signUp(
        email,
        password,
        [
          new CognitoUserAttribute({ Name: 'email', Value: email }),
          new CognitoUserAttribute({ Name: 'name', Value: `${firstName} ${lastName}` }),
        ],
        [],
        async (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(undefined);
          window.location.href = PATH_AUTH.login;
        }
      );
    });

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'cognito',
        user: {
          displayName: state?.user?.name || 'Minimals',
          role: 'admin',
          ...state.user,
        },
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
