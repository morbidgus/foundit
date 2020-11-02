import Head from 'next/head'
import styles from './index.module.css'
import Link from 'next/link';

const API_KEY = "ff6d0c4f32ea1ff05eaac906642af8bf";
const base_url = "https://api.themoviedb.org/3/movie/"

const IMAGE_URL = "https://image.tmdb.org/t/p/w500";



export async function getServerSideProps( { query }) {
  const {id} = query;
  let url = "".concat(base_url, id, '?api_key=', API_KEY )
  const res = await fetch(url);
  const data = await res.json();
  return {
    props: {
      data
    }
  }
}



export default function Movie({data}) {
  const {title, runtime, release_date, overview, vote_average, backdrop_path, tagline, genre} = data;
  console.log("data", data);
  return (
    <div className={styles.maincontainer}>
      <Head>
        <title>Found it!</title>
        <link rel="icon" href="/pageicon.png" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Catamaran:wght@100&family=Montserrat&display=swap" rel="stylesheet" />



      </Head>

      <main style={{ 
          backgroundImage:`radial-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 1)),url(${IMAGE_URL + backdrop_path})`}} className={styles.main}>

      

      <div className={styles.maincontainer}>
      
        <Link href="/"><button className={styles.back}></button></Link>
          
          <div className={styles.details}>
              <h1 className={styles.title}>{ title }</h1>
              <h3 className={styles.tagline}>"{tagline}"</h3> 
              <div className={styles.overview}>
                <p>{overview}</p>
              </div>
            
          </div>
          <div className={styles.timendate}>
            <div className={styles.scorecontainer}>
                <img src="../score.svg" />
                <h3 className={styles.score}>{vote_average}</h3>
            </div>
            <div className={styles.realeasecontainer}>
                <img src="../calendar.svg" />
                <h3 className={styles.release}>{release_date}</h3>
            </div>
            <div className={styles.timecontainer}>
                <img src="../watch.svg" />
                <h3 className={styles.time}>{runtime}</h3>
            </div>
          </div>
      </div>
      </main>


      

    </div>

    
  )
}
