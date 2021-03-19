import { useState, useEffect } from 'react';

const useFetchPost = (url) => {
  const [postsData, setPostsData] = useState([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortCont = new AbortController();
    setTimeout(() => {
    fetch(url, {
        signal : abortCont.signal ,
        method:'GET',
        headers:{   
            Authorization:`Bearer ${localStorage.getItem('token')}`
                }})
      .then(res => {
        if (!res.ok) { // error coming back from server
          throw Error('could not fetch the post now');
        } 
        return res.json();
      })
      .then(data => {
        setIsPending(false);
        setPostsData(data.posts);
        setError(null);
        //console.log('likes',likes);
      })
      .catch(err => {
          if (err.name === 'AbortError'){
            console.log('fetch aborted');
          }else {
             // auto catches network / connection error
                setIsPending(false);
                setError(err.message);
          }
      })
    }, 1000);

    return () => abortCont.abort();
  }, [url])

  return { postsData, isPending, error };
}
 
export default useFetchPost;