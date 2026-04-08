type Props = {
  total: number
  date: string
}

function PeriodSummary({ total, date }: Props) {
  return (
    <div>
      <p>{date}</p>
      <p>Total: {total.toFixed(2)} MAD</p>
    </div>
  )
}

export default PeriodSummary