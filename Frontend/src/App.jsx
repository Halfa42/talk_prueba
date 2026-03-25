import { useEffect, useState } from 'react'

function App() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('http://localhost:3000/api/test')
      .then(res => res.json())
      .then(data => {
        console.log(data) 
        setData(data)
      })
  }, [])

  return (
    <div>
      <h1>Frontend prueba</h1>
      <p>{data ? data.mensaje : 'Cargando...'}</p>
    </div>
  )
}

export default App