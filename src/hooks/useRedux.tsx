import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";

const useRedux = () => {
  const state = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  return {
    state,
    dispatch,
  };
};

export default useRedux;
