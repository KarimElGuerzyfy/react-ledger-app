type Props = {
  activePeriod: 'Day' | 'Week' | 'Month' | 'Year'
}

function PeriodFilter({ activePeriod }: Props) {
  return (
    <div>
      <button className={activePeriod === 'Day' ? 'active' : ''}>Day</button>
      <button className={activePeriod === 'Week' ? 'active' : ''}>Week</button>
      <button className={activePeriod === 'Month' ? 'active' : ''}>Month</button>
      <button className={activePeriod === 'Year' ? 'active' : ''}>Year</button>
    </div>
  )
}

export default PeriodFilter