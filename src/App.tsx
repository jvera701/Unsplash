import './App.css'
import { Input, Button, Image, Spinner } from '@chakra-ui/react'
import { useState } from 'react'
import axios from 'axios'
const { REACT_APP_apiKey } = process.env

function App() {
  const [search, setSearch] = useState('')
  const [disableNext, setDisableNext] = useState(false)
  const [arrayUrl, setArrayUrl] = useState<Array<string>>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  function updateSearch(e: any) {
    e.preventDefault()
    setSearch(e.target.value)
  }

  async function requestSearch(pageNumber: number) {
    if (search !== '') {
      setLoading(true)
      const ans = await axios.get('https://api.unsplash.com/search/photos', {
        headers: {
          Authorization: REACT_APP_apiKey as string,
        },
        params: { query: search, page: pageNumber, per_page: 9 },
      })
      const data = ans.data

      let newData: Array<string> = []
      for (let i = 0; i < data.results.length; i++) {
        const url: string = data.results[i].urls.small
        newData.push(url)
      }
      newData.length < 9 ? setDisableNext(true) : setDisableNext(false)
      setArrayUrl(newData)
      setLoading(false)
    }
  }

  function previousPage() {
    if (search !== '') {
      requestSearch(page - 1)
      setPage(page - 1)
    }
  }

  function nextPage() {
    if (search !== '') {
      requestSearch(page + 1)
      setPage(page + 1)
    }
  }

  return (
    <div className='App'>
      <div className='App-search'>
        <Input placeholder='Search' size='md' onChange={updateSearch} />
      </div>
      <div className='App-center'>
        <div className='App-images'>
          {loading ? (
            <Spinner size='xl' />
          ) : (
            arrayUrl.map(url => {
              return <Image boxSize='200px' src={url} key={url} />
            })
          )}
        </div>
      </div>
      <div className='App-bottom'>
        <Button
          colorScheme='blue'
          isDisabled={page === 1}
          onClick={previousPage}
        >
          Previous
        </Button>{' '}
        <Button colorScheme='blue' isDisabled={disableNext} onClick={nextPage}>
          Next
        </Button>{' '}
        <Button
          colorScheme='blue'
          onClick={() => {
            requestSearch(1)
            setPage(1)
          }}
        >
          Search
        </Button>
      </div>
    </div>
  )
}

export default App
