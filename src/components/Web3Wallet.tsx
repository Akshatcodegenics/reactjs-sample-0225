
import { Wallet, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWeb3 } from '@/hooks/useWeb3';

const Web3Wallet = () => {
  const { account, balance, isConnected, connectWallet, disconnectWallet } = useWeb3();

  return (
    <Card className="hover:shadow-lg transition-all duration-300 animate-scale-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wallet className="h-5 w-5" />
          <span>Web3 Wallet</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <Button onClick={connectWallet} className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Connected Account</p>
              <p className="font-mono text-sm">{account?.slice(0, 6)}...{account?.slice(-4)}</p>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
              <Coins className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Balance</p>
                <p className="font-semibold">{parseFloat(balance).toFixed(4)} ETH</p>
              </div>
            </div>
            <Button onClick={disconnectWallet} variant="outline" className="w-full">
              Disconnect
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Web3Wallet;
