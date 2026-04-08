type Props = {
  label: string
  subtitle: string
  total: number
}

function HistoryCard({ label, subtitle, total }: Props) {
  return (
    <div>
      <div>
        <p>{label}</p>
        <p>{subtitle}</p>
      </div>
      <p>{total.toFixed(2)} MAD</p>
    </div>
  )
}

export default HistoryCard