import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react';
import Link from 'next/link';

const API_KEY = "ff6d0c4f32ea1ff05eaac906642af8bf";

const IMAGE_URL = "https://image.tmdb.org/t/p/w500";


const defaultEndpoint = `https://api.themoviedb.org/3/search/movie?api_key=ff6d0c4f32ea1ff05eaac906642af8bf&query=a`;

export async function getServerSideProps() {
  const res = await fetch(defaultEndpoint)
  const data = await res.json();
  return {
    props: {
      data
    }
  }
}


export default function Home({data}) {
  const { results: defaultResults = [] } = data;
  const [results, updateResults] = useState(defaultResults);
  console.log( "data", data);
  const [page, updatePage] = useState({
    current: defaultEndpoint
  });
  
  const { current } = page;

  useEffect(() => {
    if ( current === defaultEndpoint ) return;
  
    async function request() {
      const res = await fetch(current)
      const nextData = await res.json();
  
      updatePage({
        current,
        ...nextData.info
      });
  
      if ( !nextData.info?.prev ) {
        updateResults(nextData.results);
        return;
      }
  
      updateResults(prev => {
        return [
          ...prev,
          ...nextData.results
        ]
      });
    }
  
    request();
  }, [current]);

  function handleOnSubmitSearch(e) {
    e.preventDefault();
  
    const { currentTarget = {} } = e;
    const fields = Array.from(currentTarget?.elements);
    const fieldQuery = fields.find(field => field.name === 'query');
  
    const value = fieldQuery.value || '';
    const endpoint = `https://api.themoviedb.org/3/search/movie?api_key=ff6d0c4f32ea1ff05eaac906642af8bf&query=${value}`;
  
    updatePage({
      current: endpoint
    });
  }


  return (
    <div className={styles.container}>
      <Head>
        <title>Found it!</title>
        <link rel="icon" href="/pageicon.png" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />

      </Head>

      <main className={styles.main}>
        <img className={styles.spin} src="../spin.svg" />
        <h1 className={styles.title}>
          Found it!
        </h1>

        <h4 className={styles.subtitle}>
        Search movies in one click
        </h4>

        <form  className={styles.search} onSubmit={handleOnSubmitSearch}>
          <input type="search" name="query" id={styles.inputValue} placeholder="Movie Title..." />
          <button type="submit" id={styles.searchicon}></button>
        </form>

        <ul className={styles.grid}>
          {results.map(result => {
            const { id, title, poster_path, release_date, vote_average } = result;
              return (
              <li key={id} className={styles.card}>
                <Link href="/movie/[id]" as={`/movie/${id}`}>
                    <a>
                    <img src={IMAGE_URL + poster_path} alt={`${title} Thumbnail` } className={styles.poster}/>
                    <h3 className={styles.movietitle}>{ title }</h3>
                    <h5 className={styles.releasedate}>{ release_date}</h5>
                  <div className={styles.scorecontainer}>
                      <img src="../score.svg" />
                      <h5 className={styles.score}>{ vote_average}</h5>
                  </div>
                  </a>
              </Link>
              </li>
            )
          })}
        </ul>
  
      </main>

      

    </div>

    
  )
}
