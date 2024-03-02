/* eslint-disable react/prop-types */
import React from "react";

export default function CoverPhoto({ cover }) {
  return (
    <div className="aspect-video h-full  max-h-[400px] min-h-[210px] w-full overflow-clip bg-blue-500 lg:rounded-b-xl">
      {cover && (
        <img src={cover} alt="cover" className="size-full object-cover" />
      )}
    </div>
  );
}
