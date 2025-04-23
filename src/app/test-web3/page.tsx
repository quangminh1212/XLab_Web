'use client';

import { useEffect, useState } from 'react';
import withWeb3 from '@/components/withWeb3';

interface TestWeb3PageProps {
  web3: any;
  isWeb3Ready: boolean;
}

function TestWeb3Page({ web3, isWeb3Ready }: TestWeb3PageProps) {
  const [networkId, setNetworkId] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeb3Data() {
      if (isWeb3Ready && web3) {
        try {
          // Test basic Web3 functionality
          const netId = await web3.eth.net.getId();
          setNetworkId(netId.toString());
          
          // Get accounts
          const accs = await web3.eth.getAccounts();
          setAccounts(accs);
          
          // Thử gọi một contract method để kiểm tra lỗi
          try {
            // Mockup contract object
            const mockContract = {
              methods: {
                isOwner: (sender: string) => ({
                  call: function(options: any, callback?: (err: Error | null, result: boolean) => void) {
                    if (callback) {
                      callback(null, true);
                    }
                    return Promise.resolve(true);
                  }
                })
              }
            };
            
            // Gọi contract method
            if (accs.length > 0) {
              const result = await mockContract.methods.isOwner(accs[0]).call({ from: accs[0] });
              console.log('Contract call result:', result);
            }
          } catch (contractError: any) {
            console.error('Contract call error:', contractError);
            setError(`Contract error: ${contractError.message}`);
          }
        } catch (e: any) {
          console.error('Web3 error:', e);
          setError(`Web3 error: ${e.message}`);
        }
      }
    }

    fetchWeb3Data();
  }, [web3, isWeb3Ready]);

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Web3 Test Page</h1>
      
      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Web3 Status</h2>
        <p className="mb-2">
          <span className="font-medium">Loaded:</span>{' '}
          <span className={isWeb3Ready ? 'text-green-600' : 'text-red-600'}>
            {isWeb3Ready ? 'Yes' : 'No'}
          </span>
        </p>
        {error && (
          <p className="text-red-600 mb-2">
            <span className="font-medium">Error:</span> {error}
          </p>
        )}
      </div>

      {isWeb3Ready && web3 && (
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Web3 Info</h2>
          <p className="mb-2">
            <span className="font-medium">Network ID:</span> {networkId || 'Loading...'}
          </p>
          <div className="mb-2">
            <span className="font-medium">Accounts:</span>
            {accounts.length > 0 ? (
              <ul className="list-disc list-inside mt-2">
                {accounts.map((account, index) => (
                  <li key={index} className="break-all">{account}</li>
                ))}
              </ul>
            ) : (
              <p className="ml-4 mt-1 italic">No accounts available</p>
            )}
          </div>
          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={async () => {
              try {
                // Test contract call
                const mockContract = {
                  methods: {
                    isOwner: (sender: string) => ({
                      call: function(options: any) {
                        return Promise.resolve(true);
                      }
                    })
                  }
                };
                
                // Kiểm tra xem mockContract.methods.isOwner().call có tồn tại
                if (accounts.length > 0) {
                  console.log('Testing contract call...');
                  const result = await mockContract.methods.isOwner(accounts[0]).call({ from: accounts[0] });
                  console.log('Contract call result:', result);
                  alert(`Contract call success! Result: ${result}`);
                }
              } catch (e: any) {
                console.error('Test contract call error:', e);
                setError(`Test contract error: ${e.message}`);
                alert(`Contract call error: ${e.message}`);
              }
            }}
          >
            Test Contract Call
          </button>
        </div>
      )}
    </div>
  );
}

// Wrap component with web3 HOC
export default withWeb3(TestWeb3Page); 