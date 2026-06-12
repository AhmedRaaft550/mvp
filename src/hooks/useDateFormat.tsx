const useDateFormat = () => {
  const formatTimeOnly = (created_At: string) => {
    return new Date(created_At).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const formatDateAndTime = (created_At: string) => {
    return new Date(created_At).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return { formatDateAndTime, formatTimeOnly };
};

export default useDateFormat;
