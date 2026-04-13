type Props = {
  label: string
  subtitle: string
  total: number
}

function HistoryCard({ label, subtitle, total }: Props) {
  return (
    <div>
      <div>
        <p><span className="font-['IBM_Plex_Mono']">{label}</span></p>
        <p><span className="font-['IBM_Plex_Mono']">{subtitle}</span></p>
      </div>
      <p><span className="font-['IBM_Plex_Mono']">{total.toFixed(2)}</span> MAD</p>
    </div>
  )
}

export default HistoryCard