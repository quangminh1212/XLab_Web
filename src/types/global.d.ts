// Định nghĩa kiểu dữ liệu global cho window với Web3
interface Window {
  Web3: any;
  ethereum: any;
  _web3PatchApplied?: boolean;
}

// Định nghĩa module web3
declare module 'web3' {
  const Web3: any;
  export default Web3;
} 