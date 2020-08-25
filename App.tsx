import React from 'react';
import 'react-native-gesture-handler';
import Navigator from './src/Navigator/Navigator';
import { Provider as StoreProvider } from "react-redux";
import store from './src/redux/store';

const App = () => {
  return (
      <StoreProvider store={store}>
        <Navigator />
      </StoreProvider>
  );
};

export default App;