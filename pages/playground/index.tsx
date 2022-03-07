import { NextPage } from "next";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../atom/userAtom";

const PlayGround: NextPage = () => {
  const userData = useRecoilValue(userAtom);
  return (
    <div>
      <p>
        {userData.name}
        {userData.boradPreference}
      </p>
    </div>
  );
};

export default PlayGround;
