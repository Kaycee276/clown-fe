import { WalletConnectButton } from './components/WalletConnectButton';

const App = () => {
  return (
    <>
      <div className="absolute top-6 right-8 z-50">
        <WalletConnectButton />
      </div>
      <div className="liquid-glass">
        <div className="liquid-content flex flex-col items-center">
          <h1>CLWN</h1>
          <p className="mb-4">It's funny, It's clown time!</p>
        </div>
      </div>
    </>
  );
};

export default App;
