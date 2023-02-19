import { toast } from 'react-hot-toast';
import { providers } from 'ethers';

const checkWalletConnected = async () => {
  const { ethereum } = window;

  if (!ethereum) {
    toast.error('Install Metamask');
    return {
      message: 'Install Metamask',
      account: null,
      success: false,
    };
  }

  const accounts = await ethereum.request({
    method: 'eth_accounts',
  });

  if (accounts.length !== 0) {
    const account = accounts[0];
    let provider = new providers.Web3Provider(window.ethereum);
    let network = await provider.getNetwork();
    if (network.name !== 'maticmum') {
      toast.error('Wrong Network');
      return {
        message: 'Wrong Network',
        account: null,
        success: false,
      };
    } else {
      toast.success('Maticum Connected');
      return {
        message: 'Maticum Connected',
        account: account,
        success: true,
      };
    }
  } else {
    toast.error('Connect to Metamask');
    return {
      message: 'Create a Ethereum Account',
      account: null,
      success: false,
    };
  }
};
export default checkWalletConnected;
