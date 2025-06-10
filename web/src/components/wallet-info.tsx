import { useAccount, useBalance, useEnsName } from 'wagmi'

export function WalletInfo() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({
    address,
  })
  const { data: ensName } = useEnsName({
    address,
  })

  if (!isConnected) {
    return <p className="text-muted-foreground">Please connect your wallet</p>
  }

  return (
    <div className="space-y-2">
      <div>
        <strong>Address:</strong> {ensName || address}
      </div>
      {balance && (
        <div>
          <strong>Balance:</strong> {balance.formatted} {balance.symbol}
        </div>
      )}
    </div>
  )
}