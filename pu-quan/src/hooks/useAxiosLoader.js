import { useEffect } from 'react'
import axios from 'axios'
import { useLoading } from '@/contexts/LoadingContext'

export function useAxiosLoader() {
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use((config) => {
      if (!config.hideLoading) {
        showLoading();
      }
      return config;
    });

    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        hideLoading();
        return response;
      },
      (error) => {
        hideLoading();
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);
}
