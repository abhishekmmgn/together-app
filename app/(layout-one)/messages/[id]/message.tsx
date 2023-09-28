type propsType = {
  message: string;
};

export function MessageRecieved(props: propsType) {
  return (
    <div className="w-fit max-w-[75%] py-[6px] px-[12px] rounded-lg bg-secondary">
      {props.message}
    </div>
  );
}

export function MessageSent(props: propsType) {
  return (
    <div className="w-full flex items-center justify-end">
      <div className="w-fit max-w-[75%] py-[6px] px-[12px] rounded-lg bg-[#007aff] text-white">
        {props.message}
      </div>
    </div>
  );
}
