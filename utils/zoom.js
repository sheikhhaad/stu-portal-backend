import axios from "axios";

export const getZoomToken = async () => {
  const response = await axios.post("https://zoom.us/oauth/token", null, {
    params: {
      grant_type: "account_credentials",
      account_id: process.env.ZOOM_ACCOUNT_ID,
    },
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.ZOOM_CLIENT_ID + ":" + process.env.ZOOM_CLIENT_SECRET,
        ).toString("base64"),
    },
  });

  return response.data.access_token;
};
export const createZoomMeeting = async (
  topic = "Student Session",
  duration = 30,
) => {
  const token = await getZoomToken();

  const res = await axios.post(
    "https://api.zoom.us/v2/users/me/meetings",
    {
      topic,
      type: 2,
      duration,
      password: "",
      settings: {
        waiting_room: false,
        join_before_host: true,
        participant_video: true,
        host_video: true,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};
