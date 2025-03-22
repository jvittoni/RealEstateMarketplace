import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = configureStore({
  reducer: {user: userReducer},
  middleware: (getDefaultMiddleware) => getDefaultMiddleware ({
    serializableCheck: false,
  }),
  devTools: process.env.NODE_ENV !== 'production',
});