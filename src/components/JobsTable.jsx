// WI-014: Jobs table — all listings, all columns
export default function JobsTable({ jobs }) {
  if (!jobs || jobs.length === 0) {
    return <p className="panel__placeholder">No job listings found. Add rows to your spreadsheet.</p>
  }

  return (
    <div className="jobs-table-wrapper">
      <p className="jobs-table__count">
        {jobs.length} listing{jobs.length !== 1 ? 's' : ''}
      </p>
      <div className="jobs-table-scroll">
        <table className="jobs-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Salary</th>
              <th>Keywords</th>
              <th>Location</th>
              <th>Remote</th>
              <th>Industry</th>
              <th>Size</th>
              <th>Priority</th>
              <th>Lead Source</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, i) => (
              <tr key={i}>
                <td>
                  {job.URL ? (
                    <a href={job.URL} target="_blank" rel="noreferrer" className="jobs-table__link">
                      {job['Job Title'] || '—'}
                    </a>
                  ) : (
                    job['Job Title'] || '—'
                  )}
                </td>
                <td>{job.Company || '—'}</td>
                <td className="jobs-table__salary">{job.Salary || '—'}</td>
                <td className="jobs-table__keywords">{job.Keywords || '—'}</td>
                <td>{job.Location || '—'}</td>
                <td>{job['Remote Status'] || '—'}</td>
                <td>{job.Industry || '—'}</td>
                <td>{job['Company Size'] || '—'}</td>
                <td>{job.Priority || '—'}</td>
                <td>{job['Lead Source'] || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
