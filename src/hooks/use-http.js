import { useCallback, useState } from 'react';

function useHttp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (requestConf, applyData = () => {}) => {
    setIsLoading(true);
    setError(null);

    let data;

    try {
      const response = await fetch(requestConf.url,
        {
          method: requestConf.method ? requestConf.method : 'GET',
          headers: requestConf.headers ? requestConf.headers : {},
          body: requestConf.body ? JSON.stringify(requestConf.body) : null
        }
      );

      if (!response.ok) {
        throw new Error('Request failed!');
      }

      data = await response.json();

      applyData(data);

    } catch (err) {
      setError(err.message || 'Something went wrong!');
      throw new Error(err);
    }

    setIsLoading(false);
  }, []);
  
  return { isLoading, error, sendRequest };
}

export default useHttp;

// Usage of useCallback here allows to prevent infinite loop effects which causes by 
// using useEffect() in components that use this hook, and could have dependencies which 
// is a functions shared by this hook (sendRequest() in this case)
