import type { IKeycloakUser } from "@/shared/types";

export interface AuthState {
  user: IKeycloakUser | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface SetLoadingAction {
  type: 'SET_LOADING';
  payload: boolean;
}

export interface LoginSuccessAction {
  type: 'LOGIN_SUCCESS';
  payload: IKeycloakUser;
}

export interface LogoutAction {
  type: 'LOGOUT';
}

export interface TokenRefreshSuccessAction {
  type: 'TOKEN_REFRESH_SUCCESS';
  payload: IKeycloakUser;
}

export type AuthAction = SetLoadingAction | LoginSuccessAction | LogoutAction | TokenRefreshSuccessAction;

export const authActions = {
  setLoading: (payload: boolean): SetLoadingAction => ({
    type: 'SET_LOADING',
    payload
  }),
  loginSuccess: (payload: IKeycloakUser): LoginSuccessAction => ({
    type: 'LOGIN_SUCCESS',
    payload
  }),
  logout: (): LogoutAction => ({
    type: 'LOGOUT'
  }),
  tokenRefreshSuccess: (payload: IKeycloakUser): TokenRefreshSuccessAction => ({
    type: 'TOKEN_REFRESH_SUCCESS',
    payload
  })
} as const;

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { 
        ...state, 
        loading: action.payload 
      };
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload,
        isAuthenticated: true,
        loading: false
      };
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        loading: false
      };
    case 'TOKEN_REFRESH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true
      };
    default:
      return state;
  }
};

export const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true
};