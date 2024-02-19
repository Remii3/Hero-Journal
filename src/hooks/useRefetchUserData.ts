// hooks/useUserData.js
import { useQueryClient } from 'react-query';
import { fetchUserData } from '../services/userService'; // Define this service to fetch user data
import { useDispatch } from 'react-redux';
import { updateUserData } from '../store/slices/userSlice';

export const useRefetchUserData = (uid: string) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const refetchUserData = async () => {
    try {
      const newData = await queryClient.fetchQuery(['userData', uid], () =>
        fetchUserData(uid),
      );
      dispatch(updateUserData(newData));
    } catch (err) {
      console.log(err);
    }
  };
  return { refetchUserData };
};
