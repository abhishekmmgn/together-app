import { useEffect } from 'react';
import { useUserStore } from '../store';
import { getDataFromToken } from '../helpers/getDataFromToken';
import { NextRequest } from 'next/server';

export const useSetUserIdFromToken = (request: NextRequest) => {
  const setId = useUserStore((state) => state.setId);
  
  useEffect(() => {
    const userId = getDataFromToken(request);
    setId(userId);
  }, []);
};