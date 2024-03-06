/* eslint-disable react/prop-types */
import ProfileName from "./ProfileName";
import ProfilePhoto from "./ProfilePhoto";
import Resume from "./Resume";

export default function Profile() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 border-b-2  pb-8 lg:h-[116px] lg:translate-y-0 lg:flex-row lg:items-end lg:gap-0">
      <div className="relative flex h-[90px] items-end lg:mr-4 lg:h-[180px] lg:translate-y-[15px]">
        <ProfilePhoto />
      </div>
      <ProfileName />
      <Resume />
    </div>
  );
}
