import React from 'react';
import 'react-native-gesture-handler';
import Navigator from './src/Navigator/Navigator';
import { Provider as StoreProvider } from "react-redux";
import store from './src/redux/store';

if(__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
}


const App = () => {
  return (
      <StoreProvider store={store}>
        <Navigator />
      </StoreProvider>
  );
};

export default App;